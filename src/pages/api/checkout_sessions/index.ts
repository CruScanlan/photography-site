import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe';
import { formatAmountForStripe } from 'utils/stripe-helpers';

const stripe = new Stripe(process.env.STRIPE_KEY_PRIVATE, {apiVersion: '2020-08-27'});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.method === 'POST') {
      try {
        const params: Stripe.Checkout.SessionCreateParams = {
            mode: 'payment',
            payment_method_types: ['card', 'au_becs_debit'],
            line_items: [
                {
                    price_data: {
                        currency: 'AUD',
                        product_data: {
                            name: 'Canvas Print - Rainbow Beach',
                            images: ['https://cru-scanlan-photography.vercel.app/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fx3lv0s4qe48t%2F5obor75V6kMRhr7ZZn8D6d%2F81a841b133cd88804756543d2fe98521%2Ffull-rainbow-reverse-sunset.jpg&w=1920&q=100'],
                            metadata: {
                                test: 'wow'
                            }
                        },
                        unit_amount: 20000
                    },
                    quantity: 1
                },
                {
                    price_data: {
                        currency: 'AUD',
                        product_data: {
                            name: 'Canvas Print - Rainbow Beach 2',
                            images: ['https://cru-scanlan-photography.vercel.app/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fx3lv0s4qe48t%2F5obor75V6kMRhr7ZZn8D6d%2F81a841b133cd88804756543d2fe98521%2Ffull-rainbow-reverse-sunset.jpg&w=1920&q=100'],
                            metadata: {
                                test: 'wow2'
                            }
                        },
                        unit_amount: 30000
                    },
                    quantity: 1
                }
            ],
            shipping_address_collection: {
                allowed_countries: ['AU']
            },
            success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/store`
        };

        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);
  
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

/*

const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Create a Checkout Session.
        const response = await fetchPostJSON('/api/checkout_sessions');
    
        if (response.statusCode === 500) {
          console.error(response.message)
          return
        }
    
        // Redirect to Checkout.
        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: response.id,
        })
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message)
        setLoading(false)
    }

    */