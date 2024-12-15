import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { sgMail, sgClient } from 'utils/get-sendgrid';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_KEY_PRIVATE!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-08-27',
});


const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event.
export const config = {
    api: {
        bodyParser: false,
    }
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {

        const buf = await buffer(req);
        const sig = req.headers['stripe-signature']!;
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            // On error, log and return the error message.
            if (err! instanceof Error) console.log(err);
            console.log(`❌ Error message: ${errorMessage}`);
            res.status(400).send(`Webhook Error: ${errorMessage}`);
            return
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
            await sendPaymentSucccessEmail(charge);
            
            console.log(`💵 Charge id: ${charge.id}`);
        } else {
            console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event.
        res.json({ received: true });
        return;
    }
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
}

const sendPaymentSucccessEmail = async (charge: Stripe.Charge) => {
    await sgMail.send({
        to: charge.billing_details.email,
        from: 'Cru Scanlan Photography<noreply@cruscanlan.com>',
        templateId: 'd-0c8a7336edf34dd88fa2b8e06c4859d3',
        dynamicTemplateData: {
            first_name: charge.billing_details.name.split(' ')[0]
        },
    })
    await sgClient.request({
        url: `/v3/marketing/contacts`,
        method: 'PUT',
        body: {
            list_ids: ['d09a8fdb-ce74-419c-a933-ec53bc1bc02c'], //Customers
            "contacts": [
                {
                    "email": charge.billing_details.email,
                    "address_line_1": charge.billing_details.address.line1,
                    "city": charge.billing_details.address.city,
                    "state_province_region": charge.billing_details.address.state,
                    "postal_code": charge.billing_details.address.postal_code,
                    "country": charge.billing_details.address.country,
                    "first_name": charge.billing_details.name.split(' ')[0],
                    "last_nam": charge.billing_details.name.split(' ')[1]
                }
            ]
        }
    });
    console.log(`✅ Email payment success sent to: ${charge.billing_details.email} for order: ${charge.id}`);
}

export default cors(webhookHandler as any);