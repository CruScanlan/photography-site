import { NextRequest, NextResponse } from 'next/server';
import { sgMail, sgClient } from 'utils/get-sendgrid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY_PRIVATE!, {
  apiVersion: '2020-08-27',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Cast event data to Stripe object.
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`❌ Payment failed: ${paymentIntent.last_payment_error?.message}`);
  } else if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge;
    await sendPaymentSuccessEmail(charge);
    console.log(`💵 Charge id: ${charge.id}`);
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

const sendPaymentSuccessEmail = async (charge: Stripe.Charge) => {
  // TODO (STORE): When store is re-enabled, verify sender email 'noreply@cruscanlan.com' in new SendGrid account
  // TODO (STORE): Create new dynamic template in SendGrid with {{first_name}} variable
  // TODO (STORE): Update templateId below with new template ID from SendGrid dashboard
  await sgMail.send({
    to: charge.billing_details.email!,
    from: 'Cru Scanlan Photography<noreply@cruscanlan.com>',
    templateId: 'd-0c8a7336edf34dd88fa2b8e06c4859d3', // TODO (STORE): Replace with new template ID
    dynamicTemplateData: {
      first_name: charge.billing_details.name!.split(' ')[0]
    },
  });
  
  // TODO (STORE): When store is re-enabled, create new "Customers" contact list in SendGrid Marketing
  // TODO (STORE): Update list_ids below with new list ID from SendGrid dashboard
  await sgClient.request({
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: {
      list_ids: ['d09a8fdb-ce74-419c-a933-ec53bc1bc02c'], // TODO (STORE): Replace with new list ID
      "contacts": [
        {
          "email": charge.billing_details.email,
          "address_line_1": charge.billing_details.address?.line1,
          "city": charge.billing_details.address?.city,
          "state_province_region": charge.billing_details.address?.state,
          "postal_code": charge.billing_details.address?.postal_code,
          "country": charge.billing_details.address?.country,
          "first_name": charge.billing_details.name!.split(' ')[0],
          "last_name": charge.billing_details.name!.split(' ')[1] // TODO (STORE): Fixed typo from "last_nam"
        }
      ]
    }
  });
  
  console.log(`✅ Email payment success sent to: ${charge.billing_details.email} for order: ${charge.id}`);
}

