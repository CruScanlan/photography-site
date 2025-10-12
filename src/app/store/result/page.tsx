'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchGetJSON } from 'utils/api-helpers';
import { useShoppingCart } from 'use-shopping-cart';
import Stripe from 'stripe';
import { useSearchParams } from 'next/navigation';

import ClientLayout from 'components/ClientLayout';

type Props = {
    success: boolean;
    reciptNumber: string;
    reciptUrl: string;
    customerDetails: Stripe.Checkout.Session.CustomerDetails
}

const ResultPage = () => {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { clearCart, cartCount } = useShoppingCart();
    const [data, setData] = useState<Props | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionId) return;

        const fetchData = async () => {
            try {
                const sessionData: Stripe.Checkout.Session = await fetchGetJSON(`/api/checkout_sessions/${sessionId}`);

                let reciptNumber = 'Not found, contact for more info';
                let reciptUrl = '#';

                if(sessionData.payment_intent && typeof sessionData.payment_intent !== 'string') { //Check payment intent obj exists
                    reciptUrl = sessionData.payment_intent.charges!.data[0].receipt_url || reciptUrl;
                    let stripeReciptNumber = sessionData.payment_intent.charges!.data[0].receipt_number;

                    if(stripeReciptNumber === null && typeof reciptUrl === 'string') { 
                        try {
                            await fetch(reciptUrl, { method: 'GET' });
                        } catch(e){}

                        const sessionData2: Stripe.Checkout.Session = await fetchGetJSON(`/api/checkout_sessions/${sessionId}`);

                        if(sessionData2.payment_intent && typeof sessionData2.payment_intent !== 'string') {
                            stripeReciptNumber = sessionData2.payment_intent.charges!.data[0].receipt_number;
                        }
                    }

                    reciptNumber = stripeReciptNumber || reciptNumber;
                }

                setData({
                    success: sessionData.payment_status !== 'unpaid',
                    reciptNumber,
                    reciptUrl,
                    customerDetails: sessionData.customer_details!
                });
            } catch (error) {
                console.error('Error fetching session:', error);
                setData({
                    success: false,
                    reciptNumber: '',
                    reciptUrl: '',
                    customerDetails: {} as Stripe.Checkout.Session.CustomerDetails
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sessionId]);

    useEffect(() => {
        if (data?.success && (cartCount ?? 0) > 0) {
            clearCart();
        }
    }, [data, cartCount, clearCart]);

    if (loading) {
        return (
            <ClientLayout pageTitle="Checkout Payment Result" pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
                <div className="p-8 max-w-4xl w-full">
                    <h1 className="w-full text-center">Loading...</h1>
                </div>
            </ClientLayout>
        );
    }

    if (!data) {
        return (
            <ClientLayout pageTitle="Checkout Payment Result" pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
                <div className="p-8 max-w-4xl w-full">
                    <h1 className="w-full text-center">Error Loading Payment Result</h1>
                </div>
            </ClientLayout>
        );
    }

    return (
        <ClientLayout pageTitle="Checkout Payment Result" pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
            <div className="p-8 max-w-4xl w-full">
                {
                    data.success && (
                        <>
                            <h1 className="w-full text-center">Checkout Payment Succeeded</h1>
                            <h3 className="mt-10">Thank you for your purchase!</h3>
                            <h5 className="mt-4">We will get back to you within 3 business days to update you on the status of your print via email and get it shipped out to you as soon as possible.</h5>
                            <h5 className="mt-6">Recipt number: <a className="underline hover:cursor-pointer" href={data.reciptUrl} target="_blank">{data.reciptNumber}</a></h5>
                            <h5 className="mt-2">Your contact email: <span className="font-semibold">{data.customerDetails.email}</span></h5>
                        </>
                    )
                }
                {
                    !data.success && (
                        <>
                            <h1 className="w-full text-center">Checkout Payment Failed</h1>
                            <h5 className="mt-10">If this is an error then please <Link href="/contact" className="underline">contact us</Link> and we will get it sorted out as soon as possible.</h5>
                        </>
                    )
                }
            </div>
        </ClientLayout>
    );
}

export default ResultPage;

