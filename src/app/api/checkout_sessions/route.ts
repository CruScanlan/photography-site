import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import contentful from 'utils/contentful';

const stripe = new Stripe(process.env.STRIPE_KEY_PRIVATE!, {apiVersion: '2020-08-27'});

export async function POST(request: NextRequest) {
  try {
    const cartItems = await request.json();

    const landscapeImagesContentful = (await contentful.getEntries<any>({include: 2, content_type: 'landscapeImage'})).items;
    const landscapePrintSlugs = landscapeImagesContentful.map(entry => entry.fields.slug);

    const cartItemsProductSlugValidated = cartItems.filter(cartItem => landscapePrintSlugs.includes(cartItem.product_metadata.printSlug || '')); //Check landscape image slugs exist

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for(let i=0; i<cartItemsProductSlugValidated.length; i++) {
        const cartItem = cartItemsProductSlugValidated[i];
        const landscapeImage = landscapeImagesContentful.find(entry => entry.fields.slug === cartItem.product_metadata.printSlug);
        if(!landscapeImage) continue; //Check if image exists

        const shopProduct = landscapeImage.fields.shopProducts.find(product => product.fields.productCode === cartItem.product_metadata.productCode);
        if(!shopProduct) continue; //Check if product code exists for image

        if(isNaN(cartItem.quantity) || cartItem.quantity < 1) continue; //Error check quantity

        lineItems.push({
            price_data: {
                currency: 'AUD',
                product_data: {
                    name: `${shopProduct.fields.type} - ${shopProduct.fields.size} - ${landscapeImage.fields.title}`,
                    images: [cartItem.product_metadata.printImageSrc],
                    metadata: {
                        type: shopProduct.fields.type,
                        size: shopProduct.fields.size,
                        name: landscapeImage.fields.title
                    }
                },
                unit_amount: shopProduct.fields.price*100 //Convert to cents
            },
            quantity: cartItem.quantity
        })
    }

    if(lineItems.length < 1) throw new Error(`No items in cart or items were invalid`);

    const origin = request.headers.get('origin') || 'https://cruscanlan.com';
    
    const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: lineItems,
        shipping_address_collection: {
            allowed_countries: ['AU']
        },
        success_url: `${origin}/store/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/store`
    };

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

    console.log('Created Checkout Session', {
        id: checkoutSession.id,
        url: checkoutSession.url,
        items: lineItems.map(item => item.price_data!.product_data!.name),
        amountTotal: checkoutSession.amount_total! / 100
    });

    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ statusCode: 500, message: errorMessage }, { status: 500 });
  }
}

