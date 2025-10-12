import React from 'react';
import Image from "next/image";

import ClientLayout from 'components/ClientLayout';

const PrintsPage = () => {
  return (
    <ClientLayout pageTitle={'Prints | Cru Scanlan Photography'} pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
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
                            alt="Canvas Print Example"
                            width={3930}
                            height={3929}
                            style={{
                                width: '100%',
                                height: 'auto'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </ClientLayout>
  )
};

export default PrintsPage;

