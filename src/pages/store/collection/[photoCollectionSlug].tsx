import React, { useEffect, useState } from 'react';
import contentful from 'utils/contentful';
import { getPlaiceholder } from "plaiceholder";
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import createProductImage from 'utils/productImages/create';

//import getStripe from 'utils/get-stripejs';
//import { fetchPostJSON } from 'utils/api-helpers';
//import { formatAmountForDisplay } from 'utils/stripe-helpers';

import Layout from 'components/Layout/Layout';
import NavLink from 'components/NavLink/NavLink';
import Button from 'components/Button/Button';

const StorePage = (props) => {
    const [storeSectionsOpen, setStoreSectionsOpen] = useState(false);

    const onStoreSectionsClick = () => {
        setStoreSectionsOpen(!storeSectionsOpen);
    }

    const handleCloseStoreSections = () => {
        setStoreSectionsOpen(false);
    }

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
                <div className="hidden md:block p-4 pl-2 pt-8 min-w-[14rem] lg:pl-8 lg:min-w-[16rem] border-r-[1px] border-solid border-lightTertiary">
                    <ShopSections photoCollectionOrder={props.photoCollectionOrder} locations={props.locations} />
                </div>
                <div className="flex-grow flex justify-center">
                    <div className="max-w-7xl p-8 pt-2">
                        <div className="flex flex-col justify-center pt-4 w-full md:hidden">
                            <Button fullWidth clickable size="lg" type="filled" onClick={onStoreSectionsClick}>
                                <h3>Store Sections</h3>
                                <FontAwesomeIcon className={`ml-8 transition-transform ease-in-out duration-100 ${!storeSectionsOpen ? 'rotate-180' : ''}`} icon={['fas', 'chevron-down']} />
                            </Button>
                            <div onClick={handleCloseStoreSections} className={`pt-2 border-solid border-lightSecondary shadow-lg overflow-hidden transition-[max-height] ease-in-out duration-400 ${!storeSectionsOpen ? 'max-h-0 border-0' : 'border-2 border-t-0 max-h-[1000px]'}`}>
                                <div className="px-4">
                                    <ShopSections photoCollectionOrder={props.photoCollectionOrder} locations={props.locations} />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-center p-8">
                            {props.photoCollection.name} Collection
                        </h2>
                        <div className="flex justify-center mb-10">
                            <div className="max-w-xl">
                                {documentToReactComponents(props.photoCollection.description)}
                            </div>
                        </div>
                        <div className="flex flex-row-wrap justify-between mb-4 text-sm">
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
                                props.landscapeImages.map(landscapeImage => (
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

const ShopSections = (props) => {
    return (
        <>
            <h3>Shop Collections</h3>
            <div className="w-full mt-1 border-solid border-t-[1px] border-lightSecondary" />
            <div>
                {
                    props.photoCollectionOrder.map(photoCollection => (
                        <div className="block py-2 pl-2 text-lightSecondary no-underline font-medium hover:underline hover:text-lightPrimary" key={photoCollection.slug}>
                            <NavLink href={`/store/collection/${photoCollection.slug}`} activeClassName="underline text-lightPrimary">
                                <a>{photoCollection.name}</a>
                            </NavLink>
                        </div>
                    ))
                }
            </div>
            <h3 className="mt-6">Shop Locations</h3>
            <div className="w-full mb-2 border-solid border-t-[1px] border-lightSecondary" />
            <div>
                {
                    props.locations.map(location => (
                        <div className="block py-2 pl-2 text-lightSecondary no-underline font-medium hover:underline hover:text-lightPrimary" key={location.slug}>
                            <NavLink href={`/store/location/${location.slug}`} activeClassName="underline text-lightPrimary">
                                <a>{location.name}</a>
                            </NavLink>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default StorePage;

export async function getStaticProps({ params }) {
    const photoCollectionSlug: string = params.photoCollectionSlug;
    
    const photoCollectionOrder = (await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 1})).fields.photoCollections.map(photoCollections => photoCollections.fields);

    const locations = (await contentful.getEntries<any>({include: 1, content_type: 'location'})).items.map(location => location.fields);

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
            photoCollectionOrder,
            photoCollection,
            landscapeImages,
            locations,
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