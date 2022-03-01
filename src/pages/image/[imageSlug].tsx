import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPlaiceholder } from "plaiceholder";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useComponentSize from '@rehooks/component-size';
import useWindowSize from 'hooks/useWindowSize';
import contentful from 'utils/contentful';


import Layout from 'components/Layout/Layout';
import Button from 'components/Button/Button';

type IPhotoCollectionSlugs = {
    slug: string;
    images: string[]
};

type IPhotoCollectionsSlugsArray = IPhotoCollectionSlugs[];

//TODO: Implement pre fetching for these pages to reduce load times at least 300m
//TODO: Possibly prefetch next image too

const GalleryPhotoPage = (props) => {
    const imageSlug: string = props.image.slug;
    const collectionQueryParam: string = props.collectionQueryParam;
    const image = props.image;

    const imageDimensions: {width: number; height: number} = image.fullResImage.fields.file.details.image;

    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const imageInfoSizeRef = useRef(null);
    const imageInfoSize = useComponentSize(imageInfoSizeRef);
    
    let collectionSlug: string = '';
    let nextImageSlug: string = '';
    let previousImageSlug: string = '';

    const getOtherImagesFromCollection = (collection: IPhotoCollectionSlugs) => {
        const imageIndex = collection.images.findIndex((slug) => slug === imageSlug);
        if(imageIndex === -1) return ['', '', '']; //Didnt find image in collection

        const collectionSlug = collection.slug;
        const nextImageSlug = collection.images[imageIndex+1 !== collection.images.length ? imageIndex+1 : 0];
        const previousImageSlug = collection.images[imageIndex !== 0 ? imageIndex-1 : collection.images.length-1];

        return [collectionSlug, nextImageSlug, previousImageSlug];
    }

    const photoCollectionSlugs: IPhotoCollectionsSlugsArray = props.photoCollectionSlugs;
    if(collectionQueryParam && collectionQueryParam !== '') {
        for(let i=0; i<photoCollectionSlugs.length; i++) {
            const collection = photoCollectionSlugs[i];

            if(collectionQueryParam === collection.slug) { //Found collection
                [collectionSlug, nextImageSlug, previousImageSlug] = getOtherImagesFromCollection(collection);
                break;
            }
        }
    }

    if(collectionSlug === '') {
        let found = false;
        for(let i=0; i<photoCollectionSlugs.length; i++) {
            const collection = photoCollectionSlugs[i];
            const hasImage = collection.images.findIndex((slug) => slug === imageSlug) !== -1;

            if(hasImage) { //Found set and break loop
                [collectionSlug, nextImageSlug, previousImageSlug] = getOtherImagesFromCollection(collection);
                found = true;
                break;
            }
        }
        if(!found) {
            //Didnt find anything
            console.error(`ERROR: Didnt find a collection this image belongs to for ${imageSlug}`);
        }
    }

    if(!windowWidth || !windowHeight) return <div>Error: Could not get window dimensions</div>
    let wScalingFactor = 0.87;
    let hScalingFactor = 0.92;

    if(windowWidth > 1024) wScalingFactor = 0.92; //Breakpoint

    const wRatio = (windowWidth / imageDimensions.width) * wScalingFactor;
    const hRatio =  ((windowHeight - imageInfoSize.height) / imageDimensions.height) * hScalingFactor;
    const ratio  = Math.min(hRatio, wRatio);

    const width = imageDimensions.width * ratio;
    const height = imageDimensions.height * ratio;

    const imageFile = image.fullResImage.fields.file;

    return (
        <Layout
            pageTitle={`${image.title} | Cru Scanlan Photography`} 
            pageClass="bg-darkPrimary relative"
            fullPage={true}
        >
            <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center">
                <Link href={`/image/${previousImageSlug}?collection=${collectionSlug}`}>
                    <a><FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary" icon={['fas', 'chevron-left']} size="2x" /></a>
                </Link>
            </div>
            <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center right-0">
                <Link href={`/image/${nextImageSlug}?collection=${collectionSlug}`}>
                    <a><FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary" icon={['fas', 'chevron-right']} size="2x" /></a>
                </Link>
            </div>
            <div className="absolute w-screen p-1 md:p-4 2xl:p-8 flex justify-end">
                <Link href={`/gallery/${collectionSlug}`}>
                    <a><FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary" icon={['fas', 'times']} size="2x" /></a>
                </Link>
            </div>
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div style={{width, height}} className="block">
                    {
                        image && <Image
                            priority 
                            loading="eager"
                            layout="responsive"
                            quality={100}
                            src={`https:${imageFile.url}`} 
                            width={imageFile.details.image.width} 
                            height={imageFile.details.image.height} 
                            alt={`${image.title} | ${image.location}`}
                            placeholder="blur"
                            blurDataURL={imageFile.base64}
                        />
                    }
                    {
                        !image && <div className="text-lightPrimary">Could not find Image</div>
                    }
                </div>
                <div style={{width}} className="mt-2 flex flex-col justify-between items-center md:flex-row" ref={imageInfoSizeRef}>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lightPrimary">{image.title}</h3>
                        <span className="text-sm text-lightSecondary">{image.location}</span>
                    </div>
                    <Button size="md" classes="mt-2 md:m-0 md:ml-2" href={`/store/prints/${imageSlug}`} clickable>BUY PRINT</Button>
                </div>
            </div>
        </Layout>
    )
};

export default GalleryPhotoPage;

export async function getServerSideProps(ctx) {
    const imageSlug = ctx.params.imageSlug;
    
    const photoCollectionOrderContentful = await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2}); //{include: 2} will make sure it retreieves linked assets 2 deep
    
    const photoCollectionSlugs: IPhotoCollectionsSlugsArray = photoCollectionOrderContentful.fields.photoCollections.map(item => ({
        slug: item.fields.slug,
        images: item.fields.images.map(image => image.fields.slug)
    }));

    const landscapeImages = (await contentful.getEntries<any>({include: 2, content_type: 'landscapeImage'})).items;
    let image = landscapeImages.find(landscapeImage => landscapeImage.fields.slug === imageSlug).fields;

    image.fullResImage.fields.file = {
        ...image.fullResImage.fields.file,
        base64: (await getPlaiceholder(`https:${image.fullResImage.fields.file.url}`)).base64
    }

    return {
        props: {
            photoCollectionSlugs,
            image,
            collectionQueryParam: ctx.query.collection
        }
    };
}

/* export async function getStaticPaths() {
    const landscapeImages = (await contentful.getEntries<any>({include: 2, content_type: 'landscapeImage'})).items;

    return {
        paths: landscapeImages.map(landscapeImage => ({ params: { imageSlug: landscapeImage.fields.slug, params: {} }})),
        fallback: false // false or 'blocking'
    };
} */