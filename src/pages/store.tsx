import React, { useState } from 'react';
import contentful from 'utils/contentful';
import Image from 'next/image';

import createProductImage from 'utils/productImages/create';

//import getStripe from 'utils/get-stripejs';
//import { fetchPostJSON } from 'utils/api-helpers';
//import { formatAmountForDisplay } from 'utils/stripe-helpers';

import Layout from 'components/Layout/Layout';

const StorePage = (props) => {
    return (
        <Layout 
            pageTitle={'Store | Cru Scanlan Photography'} 
            pageClass="bg-darkSecondary text-lightPrimary flex justify-center" 
            padTop={true}
        >
            <div className="max-w-7xl p-8">
                <h1 className="text-center p-8">
                    Print Store
                </h1>
                <div className="flex flex-row flex-wrap items-center justify-center">
                    {
                        props.landscapeImages.map(landscapeImage => (
                            <div className="p-4 w-96" key={landscapeImage.slug}>
                                <div className="w-full h-full hover:cursor-pointer">
                                    <Image
                                        src={landscapeImage.productImage.publicFile}
                                        width={landscapeImage.productImage.width}
                                        height={landscapeImage.productImage.height}
                                        quality={85}
                                    />
                                </div>
                                <h4 className="hover:cursor-pointer">{landscapeImage.title}</h4>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Layout>
    )
};

export default StorePage;

export async function getStaticProps() {
    const landscapeImagesContentful = (await contentful.getEntries<any>({include: 2, content_type: 'landscapeImage'})).items.map(image => image.fields);

    const productImagesPromises = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) {
        const landscapeImage = landscapeImagesContentful[i];
        const file = landscapeImage.fullResImage.fields.file;

        const imageUrl = `https:${file.url}`;
        productImagesPromises.push(createProductImage(imageUrl, file.fileName));
    } //Get product images

    const productImages = await Promise.all(productImagesPromises);

    const landscapeImages = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) {
        landscapeImages.push({
            ...landscapeImagesContentful[i],
            productImage: productImages[i]
        });
    } //Get landscape images with product images

    return {
        props: {
            landscapeImages
        }
    }
}