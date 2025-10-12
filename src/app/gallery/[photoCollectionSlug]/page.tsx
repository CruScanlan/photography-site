import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import PhotoAlbum from "react-photo-album";
import contentful from 'utils/contentful';
import { generateTinyPlaceholder, generateHighQualityPlaceholder } from 'utils/generate-placeholder';

import ClientLayout from 'components/ClientLayout';
import NavLink from 'components/NavLink';
import GalleryImage from './gallery-image';

export async function generateStaticParams() {
    const photoCollectionOrderContentful = await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2});
    const collectionSlugs = photoCollectionOrderContentful.fields.photoCollections.map(item => item.fields.slug);

    return collectionSlugs.map((slug) => ({
        photoCollectionSlug: slug,
    }));
}

async function getData(photoCollectionSlug: string) {
    const photoCollectionOrderContentful = await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2});
    const collections = photoCollectionOrderContentful.fields.photoCollections.map(item => ({name: item.fields.name, slug: item.fields.slug}));
    const collection = photoCollectionOrderContentful.fields.photoCollections.find(photoCollection => photoCollection.fields.slug === photoCollectionSlug).fields;
    
    // Use high-quality placeholder for hero image (it's the main image users see first)
    let heroImage = collection.heroImage.fields;
    heroImage.file = {
        ...heroImage.file,
        base64: await generateHighQualityPlaceholder(`https:${heroImage.file.url}`)
    };

    let landscapeImagesContentful = collection.images.map(image => image.fields);
    let landscapeImages: any[] = [];
    
    // Use tiny placeholders for gallery images (much faster to generate)
    for(let i=0; i<landscapeImagesContentful.length; i++) {
        landscapeImagesContentful[i].fullResImage.fields.file = {
            ...landscapeImagesContentful[i].fullResImage.fields.file,
            base64: await generateTinyPlaceholder(`https:${landscapeImagesContentful[i].fullResImage.fields.file.url}`)
        };
        landscapeImages.push(landscapeImagesContentful[i]);
    }

    return {
        slug: photoCollectionSlug,
        heroImage,
        collections,
        landscapeImages,
        collectionName: collection.name
    };
}

export async function generateMetadata({ params }: { params: Promise<{ photoCollectionSlug: string }> }) {
    const { photoCollectionSlug } = await params;
    const data = await getData(photoCollectionSlug);
    
    return {
        title: `${data.collectionName} | Cru Scanlan Photography`,
        openGraph: {
            title: `${data.collectionName} | Cru Scanlan Photography`,
            url: `https://cruscanlan.com/gallery/${data.slug}`,
            images: [{
                url: `https:${data.heroImage.file.url}?w=1080&q=95`,
            }]
        }
    };
}

const Gallery = async ({ params }: { params: Promise<{ photoCollectionSlug: string }> }) => {
    const { photoCollectionSlug } = await params;
    const props = await getData(photoCollectionSlug);
    
    const photos = props.landscapeImages.map((landscapeImage: any) => {
        const image = landscapeImage.fullResImage.fields;

        return {
            src: `https:${image.file.url}`,
            base64: image.file.base64,
            width: image.file.details.image.width,
            height: image.file.details.image.height,
            alt: landscapeImage.title,
            title: landscapeImage.title,
            imageSlug: landscapeImage.slug,
            collectionSlug: props.slug
        }
    });

    return (
        <ClientLayout 
            pageTitle={`${props.collectionName} | Cru Scanlan Photography`} 
            pageClass="bg-darkSecondary" 
            navbarScrollAnimation={{
                enabled: true,
                startPositonRelative: 0.2,
                startPositionAbsolute: 25,
                endPositionRelative: 0.4,
                endPositionAbsolute: 120
            }}
            ogImage={props.heroImage.file.url}
            ogUrl={`https://cruscanlan.com/gallery/${props.slug}`}
        >
            <div className="w-full h-[60vh]">
                <Image 
                    className="w-full h-[60vh] !fixed z-[0] overflow-hidden"
                    alt="Image" 
                    loading="eager"
                    quality={95}
                    priority
                    placeholder='blur'
                    blurDataURL={props.heroImage.file.base64}
                    src={`https:${props.heroImage.file.url}`} 
                    width={props.heroImage.file.details.image.width} 
                    height={props.heroImage.file.details.image.height}
                    sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </div>
            <div className="w-full relative p-4 text-lightPrimary bg-darkPrimary shadow-xl flex items-center flex-col text-center md:flex-row md:text-left">
                <div className="p-2">
                    <h3 className="uppercase min-w-max">
                        Image Collections
                    </h3>
                    <span className="text-xs uppercase text-lightSecondary">
                        Cru Scanlan Photography
                    </span>
                </div>
                <div className="w-full border-[1px] border-solid border-lightSecondary md:hidden" />
                <div className="relative flex flex-col flex-wrap items-baseline md:flex-row md:pl-4">
                    {
                        props.collections.map((collection: any) => (
                            <div className="p-2 w-full text-center text-lightSecondary hover:text-lightPrimary md:text-left md:w-auto" key={collection.slug}>
                                <NavLink activeClassName="!text-lightPrimary" href={`/gallery/${collection.slug}`}>
                                    <h4>
                                        {collection.name}
                                    </h4>
                                </NavLink>
                            </div>
                        ))
                    }     
                </div>
            </div>
            <div className="relative p-4 bg-darkSecondary">
                <PhotoAlbum 
                    layout="rows"
                    photos={photos}
                    renderPhoto={GalleryImage}
                    spacing={6}
                    targetRowHeight={650}
                    rowConstraints={{maxPhotos: 4}}
                    breakpoints={[320, 640, 768, 1024, 1280, 1536, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900]}
                />
            </div>
        </ClientLayout>
    );
};

export default Gallery;

