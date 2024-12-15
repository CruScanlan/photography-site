import React from 'react';
import Layout from 'components/Layout';
import Link from 'next/link';
import Button from 'components/Button';

const ThankYou = () => {
    return (
        <Layout 
            pageTitle="Thank You | Your Name Photography"
            pageClass="bg-darkSecondary text-lightPrimary w-full flex justify-center"
            padTop={true}
        >
            <div className="bg-darkSecondary container mx-auto px-4 text-center my-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Thank You!</h1>
                <p className="text-xl mb-8">
                    I appreciate you reaching out. I'll get back to you as soon as possible.
                </p>
                <Link 
                    href="/"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Button
                        type="filled"
                        size="md"
                        clickable
                        classes="text-white"
                    >
                        Return Home
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default ThankYou; 