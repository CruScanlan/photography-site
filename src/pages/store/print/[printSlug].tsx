import React from 'react';
import contentful from 'utils/contentful';
import Image from 'next/image';
import { getPlaiceholder } from "plaiceholder";
import ProductCarousel from 'components/ProductCarousel';

import createProductImage from 'utils/productImages/create';
import Layout from 'components/Layout';

const ProductPage = (props) => {
    const landscapeImageFile = props.landscapeImage.fullResImage.fields.file;

    const slides = [
        {
            id: 1,
            src: `https:${landscapeImageFile.url}`,
            width: landscapeImageFile.details.image.width,
            height: landscapeImageFile.details.image.height,
            base64: props.landscapeImage.base64
        },
        {
            id: 2,
            src: props.productImage.publicFile,
            width: props.productImage.width,
            height: props.productImage.height,
            base64: props.productImage.base64
        },
        {
            id: 3,
            src: `https:${landscapeImageFile.url}`,
            width: landscapeImageFile.details.image.width,
            height: landscapeImageFile.details.image.height,
            base64: props.landscapeImage.base64
        },
        {
            id: 4,
            src: props.productImage.publicFile,
            width: props.productImage.width,
            height: props.productImage.height,
            base64: props.productImage.base64
        },
    ];

    return (
        <Layout pageTitle={'Product | Cru Scanlan Photography'} pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
            <div className="max-w-3xl p-8 w-full">
                <h1 className="text-center p-8">
                    Product
                </h1>
                <ProductCarousel slides={slides} />
                <div className="w-full">
                    
                </div>
            </div>
        </Layout>
    )
};

export default ProductPage;

export const getStaticProps = async ({ params }) => {
    const printSlug: string = params.printSlug;

    const landscapeImage = (await contentful.getEntries<any>({include: 2, content_type: 'landscapeImage', 'fields.slug': printSlug})).items[0].fields
    landscapeImage.base64 = (await getPlaiceholder(`https:${landscapeImage.fullResImage.fields.file.url}`)).base64

    const file = landscapeImage.fullResImage.fields.file;
    const productImageData = await createProductImage(`https:${file.url}`, file.fileName);

    const productImage = {
        ...productImageData,
        base64: (await getPlaiceholder(productImageData.publicFile)).base64
    };

    return {
        props: {
            landscapeImage,
            productImage
        }
    }
}

export const getStaticPaths = async () => {
    const landscapeImagesContentful = (await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage', 'fields.shop': true})).items

    const landscapeSlugs = landscapeImagesContentful.map(item => item.fields.slug);

    return {
        paths: landscapeSlugs.map(landscapeSlug => ({ params: { printSlug: landscapeSlug }})),
        fallback: false // false or 'blocking'
    };
}