import React from 'react';
import Link from 'next/link';
import Image from "next/image";
import PhotoAlbum from "react-photo-album";
import { getPlaiceholder } from "plaiceholder";
import contentful from 'utils/contentful';

import Layout from 'components/Layout';
import NavLink from 'components/NavLink';

type IRenderGalleryImageProps = {
    photo: {
        src: string;
        width: number;
        height: number;
        imageSlug: string;
        collectionSlug: string;
        base64: string;
    };
    imageProps: {
        src: string;
        alt: string;
        title?: string;
        style: React.CSSProperties;
    } & React.HTMLAttributes<HTMLImageElement>;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
};

const RenderGalleryImage: React.FC<IRenderGalleryImageProps> = ({ photo, imageProps, wrapperProps }) => {
    const { width, height, imageSlug, collectionSlug, base64 } = photo;
    const { src, alt, title, style } = imageProps;
    const { style: wrapperStyle, ...restWrapperProps } = wrapperProps ?? {};

    return (
        <div 
            className="relative hover:cursor-pointer" 
            style={{
                ...wrapperStyle,
                position: 'relative',
                width: style.width,
                padding: style.padding,
                marginBottom: style.marginBottom
            }}
            {...restWrapperProps}
        >
            <Link href={`/image/${imageSlug}?collection=${collectionSlug}`} legacyBehavior>
                <div className="w-full h-full z-10 absolute flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100">
                    <div className="p-2 w-full bg-opacity-80 bg-darkSecondary">
                        <h4 className="text-lightPrimary">{ title }</h4>
                    </div>
                </div>
            </Link>
            <Image 
                quality={92}
                src={src} 
                width={width} 
                height={height} 
                sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                alt={alt}
                placeholder="blur"
                blurDataURL={base64}
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
        </div>
    );
}

const Gallery = (props) => {
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
        <Layout 
            pageTitle={`${props.collectionName} | Cru Scanlan Photography`} 
            pageClass="bg-darkSecondary" 
            navbarScrollAnimation={{
                enabled: true,
                startPositonRelative: 0.2,
                startPositionAbsolute: 25,
                endPositionRelative: 0.4,
                endPositionAbsolute: 120
            }}
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
                                    <a>
                                        <h4>
                                            {collection.name}
                                        </h4>
                                    </a>
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
                    renderPhoto={RenderGalleryImage}
                    spacing={6}
                    targetRowHeight={650}
                    rowConstraints={{maxPhotos: 4}}
                    breakpoints={[320, 640, 768, 1024, 1280, 1536, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900]}
                />
            </div>
        </Layout>
    )
};

export default Gallery;
 
export async function getStaticProps({ params }) {
    const photoCollectionSlug = params.photoCollectionSlug;

    const photoCollectionOrderContentful = await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2}); //{include: 2} will make sure it retreieves linked assets 2 deep

    const collections = photoCollectionOrderContentful.fields.photoCollections.map(item => ({name: item.fields.name, slug: item.fields.slug})) //Name and slug

    const collection = photoCollectionOrderContentful.fields.photoCollections.find(photoCollection => photoCollection.fields.slug === photoCollectionSlug).fields;
    let heroImage = collection.heroImage.fields;

    heroImage.file = {
        ...heroImage.file,
        base64: (await getPlaiceholder(`https:${heroImage.file.url}`)).base64
    }; //Get base64 blurred placeholder

    let landscapeImagesContentful = collection.images.map(image => image.fields);
    let landscapeImages = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) {
        landscapeImagesContentful[i].fullResImage.fields.file = {
            ...landscapeImagesContentful[i].fullResImage.fields.file,
            base64: (await getPlaiceholder(`https:${landscapeImagesContentful[i].fullResImage.fields.file.url}`)).base64
        }; //Get base64 blurred placeholder

        landscapeImages.push(landscapeImagesContentful[i]);
    }

    return {
        props: {
            slug: photoCollectionSlug,
            heroImage,
            collections,
            landscapeImages,
            collectionName: collection.name
        }
    };
}

export async function getStaticPaths() {
    const photoCollectionOrderContentful = await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2});

    const collectionSlugs = photoCollectionOrderContentful.fields.photoCollections.map(item => item.fields.slug) //Name and slug

    return {
        paths: collectionSlugs.map(collectionSlug => ({ params: { photoCollectionSlug: collectionSlug }})),
        fallback: false // false or 'blocking'
    };
}