import React, { useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useComponentSize from '@rehooks/component-size';
import useWindowSize from 'hooks/useWindowSize';
import contentful from 'utils/contentful';

import { performance } from 'perf_hooks';

import Layout from 'components/Layout';
import { getPlaiceholder } from 'plaiceholder';

type IPhotoCollectionSlugs = {
    slug: string;
    images: string[]
};

type IPhotoCollectionsSlugsArray = IPhotoCollectionSlugs[];

//TODO: Implement pre fetching for these pages to reduce load times at least 300m
//TODO: Possibly prefetch next image too

type IImageDimensions = {width: number; height: number};

const GalleryPhotoPage = ({ image, collectionSlug, nextImageSlug, previousImageSlug, nextImage, previousImage}) => {
    const imageSlug: string = image.slug;

    const getImageSize = (imageDimensions: IImageDimensions): IImageDimensions => {
        const wRatio = (windowWidth / imageDimensions.width) * wScalingFactor;
        const hRatio =  ((windowHeight - imageInfoSize.height) / imageDimensions.height) * hScalingFactor;
        const ratio  = Math.min(hRatio, wRatio);

        const width = imageDimensions.width * ratio;
        const height = imageDimensions.height * ratio;

        return {width, height}
    }

    const imageDimensionsPrimary: IImageDimensions = image.fullResImage.fields.file.details.image;
    const imageDimensionsNext: IImageDimensions = nextImage.fullResImage.fields.file.details.image;
    const imageDimensionsPrevious: IImageDimensions = previousImage.fullResImage.fields.file.details.image;

    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const imageInfoSizeRef = useRef(null);
    const imageInfoSize = useComponentSize(imageInfoSizeRef);

    if(!windowWidth || !windowHeight) return <div>Error: Could not get window dimensions</div>
    let wScalingFactor = 0.87;
    let hScalingFactor = 0.92;

    if(windowWidth > 1024) wScalingFactor = 0.92; //Breakpoint

    const { width, height } = getImageSize(imageDimensionsPrimary);
    const { width: widthNext, height: heightNext } = getImageSize(imageDimensionsNext);
    const { width: widthPrevious, height: heightPrevious } = getImageSize(imageDimensionsPrevious);

    const imageFile = image.fullResImage.fields.file;
    const nextImageFile = nextImage.fullResImage.fields.file;
    const previousImageFile = previousImage.fullResImage.fields.file;

    const location = image.location ? image.location.fields.name : 'Unknown Location';

    return (
        (<Layout
            pageTitle={`${image.title} | Cru Scanlan Photography`} 
            pageClass="bg-darkPrimary relative"
            fullPage={true}
        >
            <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center">
                <Link href={`/image/${previousImageSlug}?collection=${collectionSlug}`}>
                    <FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary" icon={['fas', 'chevron-left']} size="2x" />
                </Link>
            </div>
            <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center right-0">
                <Link href={`/image/${nextImageSlug}?collection=${collectionSlug}`}>
                    <FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary" icon={['fas', 'chevron-right']} size="2x" />
                </Link>
            </div>
            <div className="absolute w-screen p-1 md:p-4 2xl:p-8 flex justify-end">
                <Link href={`/gallery/${collectionSlug}`}>
                    <FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary" icon={['fas', 'times']} size="2x" />
                </Link>
            </div>
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div style={{width, height}} className="block">
                    {
                        image && <Image
                            priority 
                            loading="eager"
                            quality={98}
                            src={`${imageFile.url}`} 
                            width={imageFile.details.image.width} 
                            height={imageFile.details.image.height} 
                            sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                            alt={`${image.title} | ${location} | Cru Scanlan Photography`}
                            //placeholder="blur"
                            //blurDataURL={imageFile.base64}
                            style={{
                                objectFit: 'contain'
                            }}
                        />
                    }
                    {
                        !image && <div className="text-lightPrimary">Could not find Image</div>
                    }
                </div>
                <div style={{width: widthNext, height: heightNext}} className="block absolute opacity-0 -z-10">
                    {
                        nextImage && <Image
                            loading="lazy"
                            quality={98}
                            src={`https:${nextImageFile.url}`} 
                            width={nextImageFile.details.image.width} 
                            height={nextImageFile.details.image.height}
                            sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    }
                </div>
                <div style={{width: widthPrevious, height: heightPrevious}} className="block absolute opacity-0 -z-10">
                    {
                        previousImage && <Image
                            loading="lazy"
                            quality={98}
                            src={`https:${previousImageFile.url}`} 
                            width={previousImageFile.details.image.width} 
                            height={previousImageFile.details.image.height}
                            sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    }
                </div>
                <div style={{width}} className="mt-2 flex flex-col justify-between items-center md:flex-row" ref={imageInfoSizeRef}>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lightPrimary">{image.title}</h3>
                        <span className="text-sm text-lightSecondary">{location}</span>
                    </div>
                    {/* <Button size="md" classes="mt-2 md:m-0 md:ml-2" href={`/store/print/${imageSlug}`} clickable>BUY PRINT</Button> */}
                </div>
            </div>
        </Layout>)
    );
};

export default GalleryPhotoPage;

export async function getServerSideProps(ctx) {
    const imageSlug = ctx.params.imageSlug;

    const startTimeTotal = performance.now();
    let startTime = startTimeTotal;

    let [photoCollectionOrderContentful, landscapeImagesContentful] = await Promise.all([
        contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2}),
        contentful.getEntries<any>({include: 1, content_type: 'landscapeImage'})
    ]);
    
    let endTime = performance.now();
    console.log(`[imageSlug]:${imageSlug} | Downloaded contentful data in ${endTime - startTime}ms`);

    const landscapeImages = landscapeImagesContentful.items;

    const photoCollectionSlugs: IPhotoCollectionsSlugsArray = photoCollectionOrderContentful.fields.photoCollections.map(item => ({
        slug: item.fields.slug,
        images: item.fields.images.map(image => image.fields.slug)
    }));

    let image = landscapeImages.find(landscapeImage => landscapeImage.fields.slug === imageSlug).fields;

    /* startTime = performance.now();

    image.fullResImage.fields.file = {
        ...image.fullResImage.fields.file,
        base64: (await getPlaiceholder(`https:${image.fullResImage.fields.file.url}`)).base64
    }

    endTime = performance.now();
    console.log(`[imageSlug]:${imageSlug} | Created Plaiceholder data in ${endTime - startTime}ms`); */

    //Get collection slugs
    const collectionQueryParam = ctx.query.collection;

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

    const nextImage = landscapeImages.find(landscapeImage => landscapeImage.fields.slug === nextImageSlug).fields;
    const previousImage = landscapeImages.find(landscapeImage => landscapeImage.fields.slug === previousImageSlug).fields;

    endTime = performance.now();
    console.log(`[imageSlug]:${imageSlug} | Finished generating page data in total time ${endTime - startTimeTotal}ms`);

    return {
        props: {
            image,
            collectionSlug,
            nextImageSlug,
            nextImage,
            previousImageSlug,
            previousImage
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