import { NextPage } from 'next';
import Link from 'next/link';
import { fetchGetJSON } from 'utils/api-helpers';
import { useShoppingCart } from 'use-shopping-cart';
import Stripe from 'stripe';

import Layout from 'components/Layout';

type Props = {
    success: boolean;
    reciptNumber: string;
    reciptUrl: string;
    customerDetails: Stripe.Checkout.Session.CustomerDetails
}

const ResultPage: NextPage<Props> = ({ success, reciptNumber, reciptUrl, customerDetails }) => {
    const { clearCart, cartCount } = useShoppingCart();

    if(success && cartCount > 0) clearCart();

    return (
        (<Layout pageTitle="Checkout Payment Result"  pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
            <div className="p-8 max-w-4xl w-full">
                {
                    success && (
                        <>
                            <h1 className="w-full text-center">Checkout Payment Succeeded</h1>
                            <h3 className="mt-10">Thank you for your purchase!</h3>
                            <h5 className="mt-4">We will get back to you within 3 business days to update you on the status of your print via email and get it shipped out to you as soon as possible.</h5>
                            <h5 className="mt-6">Recipt number: <a className="underline hover:cursor-pointer" href={reciptUrl} target="_blank" >{reciptNumber}</a></h5>
                            <h5 className="mt-2">Your contact email: <span className="font-semibold">{customerDetails.email}</span></h5>
                        </>
                    )
                }
                {
                    !success && (
                        <>
                            <h1 className="w-full text-center">Checkout Payment Failed</h1>
                            <h5 className="mt-10">If this is an error then please <Link href="/contact" className="underline">contact us</Link> and we will get it sorted out as soon as possible.</h5>
                        </>
                    )
                }
            </div>
        </Layout>)
    );
}

export async function getServerSideProps({ req, query }) {
    const data: Stripe.Checkout.Session = await fetchGetJSON(`http://${req.headers.host}/api/checkout_sessions/${query.session_id}`);

    let reciptNumber = 'Not found, contact for more info';
    let reciptUrl = '#';

    if(typeof data.payment_intent !== 'string') { //Check payment intent obj exists
        reciptUrl = data.payment_intent.charges.data[0].receipt_url || reciptUrl;
        let stripeReciptNumber = data.payment_intent.charges.data[0].receipt_number;

        if(stripeReciptNumber === null && typeof reciptUrl === 'string') { //Found recipt url but no recipt number. Fetch the recipt url to prompt the api to generate a recipt number and refetch recipt number
            try {
                await fetch(reciptUrl, { method: 'GET' });
            } catch(e){} //Use try catch to avoid error "Parse Error: Header overflow"

            const data2: Stripe.Checkout.Session = await fetchGetJSON(`http://${req.headers.host}/api/checkout_sessions/${query.session_id}`);

            if(typeof data2.payment_intent !== 'string') stripeReciptNumber = data2.payment_intent.charges.data[0].receipt_number;            
        }

        reciptNumber = stripeReciptNumber || reciptNumber;
    }

    return {
        props: {
            success: data.payment_status !== 'unpaid',
            reciptNumber,
            reciptUrl,
            customerDetails: data.customer_details
        }
    }
}

export default ResultPage