import React from 'react';
import Image from 'next/image';

import Layout from 'components/Layout';

const PrintsPage = () => {
  return (
    <Layout pageTitle={'Prints | Cru Scanlan Photography'} pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
        <div className="flex flex-col items-center w-full">
            <div className="max-w-4xl p-8">
                <h1 className="text-center p-8">
                    Prints
                </h1>
            </div>
            <div className="w-screen">
                <div className="w-full h-full">
                    <div className="h-auto w-[40%]">
                        <Image
                            src="/canvas1.png"
                            layout="responsive"
                            width={3930}
                            height={3929}
                        />
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
};

export default PrintsPage;