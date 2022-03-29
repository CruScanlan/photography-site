import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import contentful from 'utils/contentful';

const stripe = new Stripe(process.env.STRIPE_KEY_PRIVATE, {apiVersion: '2020-08-27'});

export default async function handler(
        req: NextApiRequest,
        res: NextApiResponse
    ) {
    if(req.method === 'POST') {
        try {
            const cartItems = req.body;

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

            const params: Stripe.Checkout.SessionCreateParams = {
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: lineItems,
                shipping_address_collection: {
                    allowed_countries: ['AU']
                },
                success_url: `${req.headers.origin}/store/result?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/store`
            };

            const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

            console.log('Created Checkout Session', {
                id: checkoutSession.id,
                url: checkoutSession.url,
                items: lineItems.map(item => item.price_data.product_data.name),
                amountTotal: checkoutSession.amount_total/100
            });

            res.status(200).json(checkoutSession);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Internal server error';
            res.status(500).json({ statusCode: 500, message: errorMessage });
        }
        return;
    }

    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
}