import React from 'react';
import contentful from 'utils/contentful';
import { getPlaiceholder } from "plaiceholder";
import Image from 'next/image';
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import createProductImage from 'utils/productImages/create';

//import getStripe from 'utils/get-stripejs';
//import { fetchPostJSON } from 'utils/api-helpers';
//import { formatAmountForDisplay } from 'utils/stripe-helpers';

import Layout from 'components/Layout/Layout';

const StorePage = (props) => {
    return (
        <Layout 
            pageTitle={'Store | Cru Scanlan Photography'} 
            pageClass="bg-darkSecondary" 
            navbarScrollAnimation={{
                enabled: true,
                startPositonRelative: 0.15,
                startPositionAbsolute: 20,
                endPositionRelative: 0.3,
                endPositionAbsolute: 90
            }}
        >
            <div className="w-full h-[45vh]">
                <Image 
                    className="w-full h-[45vh] !fixed z-[0] overflow-hidden"
                    alt="Image" 
                    loading="eager"
                    quality={98}
                    layout="responsive"
                    objectFit="cover"
                    priority
                    placeholder='blur'
                    blurDataURL={props.banner.base64}
                    src={props.banner.img}
                />
            </div>
            <div className="relative text-lightPrimary flex bg-darkSecondary">
                <div className="p-4 pt-12">
                    Test
                </div>
                <div className="flex-grow flex justify-center">
                    <div className="max-w-7xl p-8 pt-2">
                        <h2 className="text-center p-8">
                            {props.photoCollection.name} Collection
                        </h2>
                        <div className="flex justify-center mb-10">
                            <div className="max-w-xl">
                                {documentToReactComponents(props.photoCollection.description)}
                            </div>
                        </div>
                        <div className="flex flex-row justify-between mb-4 text-sm">
                            <div>
                                <span className="text-lightSecondary">
                                    <Link href="/store">
                                        <a>Store</a>
                                    </Link>
                                    <span> / Collection / </span>
                                </span>
                                <span>
                                    {props.photoCollection.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-lightSecondary">Showing {props.landscapeImages.length} results</span>
                            </div>
                        </div>
                        <div className="grid gap-8 auto-rows-min grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {
                                props.landscapeImages.map(landscapeImage => ( //min-w-[16rem] max-w-[24rem]
                                    <div key={landscapeImage.slug}>
                                        <div className="w-full hover:cursor-pointer">
                                            <Image
                                                src={landscapeImage.productImage.publicFile}
                                                width={landscapeImage.productImage.width}
                                                height={landscapeImage.productImage.height}
                                                quality={90}
                                            />
                                        </div>
                                        <h4 className="text-center hover:cursor-pointer">{landscapeImage.title}</h4>
                                        <p className="text-center text-lightSecondary text-sm">From ${landscapeImage.products[0].price} AUD</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
};

export default StorePage;

export async function getStaticProps({ params }) {
    const photoCollectionSlug: string = params.photoCollectionSlug;
    
    const photoCollection = (await contentful.getEntries<any>({include: 2, content_type: 'photoCollection', 'fields.slug': photoCollectionSlug})).items[0].fields
    const landscapeImagesContentful = photoCollection.images.map(image => image.fields);

    const productImagesPromises = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) { //landscapeImagesContentful.length
        const landscapeImage = landscapeImagesContentful[i];
        const file = landscapeImage.fullResImage.fields.file;

        const imageUrl = `https:${file.url}`;
        productImagesPromises.push(createProductImage(imageUrl, file.fileName));
    } //Get product images

    const productImages = await Promise.all(productImagesPromises);

    const landscapeImages = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) {
        const landscapeImageContentful = landscapeImagesContentful[i];
        if(!landscapeImageContentful.shop) continue; //Needs to be a shop image
        if(!landscapeImageContentful.shopProducts || landscapeImageContentful.shopProducts.length < 1) continue; //Needs to have a shop product attached

        const products = landscapeImagesContentful[i].shopProducts.map(shopProduct => shopProduct.fields).sort((first, second) => first.price - second.price); //Get products by acending price order

        landscapeImages.push({
            ...landscapeImageContentful,
            products,
            productImage: productImages[i]
        });
    } //Get landscape images with product images


    const banner = await getPlaiceholder("/storeBanner.jpg");

    return {
        props: {
            photoCollection,
            landscapeImages,
            banner: {
                img: banner.img,
                base64: banner.base64
            }
        }
    }
}

export async function getStaticPaths() {
    const photoCollectionsContentful = await contentful.getEntries<any>({include: 1, content_type: 'photoCollection'})

    const collectionSlugs = photoCollectionsContentful.items.map(item => item.fields.slug) //Name and slug

    return {
        paths: collectionSlugs.map(collectionSlug => ({ params: { photoCollectionSlug: collectionSlug }})),
        fallback: false // false or 'blocking'
    };
}