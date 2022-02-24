import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PhotoAlbum, { PhotoProps } from "react-photo-album";
import contentful from 'utils/contentful';

import Layout from 'components/Layout/Layout';
import NavLink from 'components/NavLink/NavLink';

type IRenderGalleryImageProps  = PhotoProps<{
    src: string;
    width: number;
    height: number;
    key: string;
    imageSlug: string;
    collectionSlug: string;
}> & { wrapperProps?: React.HTMLAttributes<HTMLDivElement>; };

const RenderGalleryImage: React.FC<IRenderGalleryImageProps> = ({ photo, imageProps, wrapperProps }) => {
    const { width, height, key, imageSlug, collectionSlug } = photo;
    const { src, alt, title, style, sizes, className } = imageProps;
    const { style: wrapperStyle, ...restWrapperProps } = wrapperProps ?? {};

    if(!photo) return <div>Error Getting Image</div>;

    return (
        <div className="w-full relative hover:cursor-pointer" 
            style={{
                width: style.width,
                padding: style.padding,
                marginBottom: style.marginBottom,
                ...wrapperStyle
            }}
            {...restWrapperProps} 
            key={key}
        >
            <Link href={`/image/${imageSlug}?collection=${collectionSlug}`}>
                <div className="w-full h-full z-10 absolute flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100">
                    <div className="c-galleryImage p-2 w-full bg-opacity-80 bg-darkSecondary">
                        <h4 className="text-lightPrimary font">
                            { title }
                        </h4>
                    </div>
                </div>
            </Link>
            <Image 
                className="c-galleryImage__gatsby w-full h-full absolute" 
                quality={95} 
                src={src} 
                width={width} 
                height={height} 
                layout="responsive" 
                alt={alt}
            />
        </div>
    )
}

const Gallery = (props) => {
    const photos = props.landscapeImages.map((landscapeImage: any) => {
        const image = landscapeImage.fullResImage.fields;

        return {
            key: landscapeImage.slug,
            src: `https:${image.file.url}`,
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
            pageTitle={'Gallery | Cru Scanlan Photography'} 
            pageClass="p-gallery bg-darkSecondary" 
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
                    quality={98}
                    layout="responsive"
                    objectFit="cover"
                    priority
                    src={`https:${props.heroImage.file.url}`} 
                    width={props.heroImage.file.details.image.width} 
                    height={props.heroImage.file.details.image.height}
                />
            </div>
            <div className="w-full relative p-4 text-lightPrimary bg-darkPrimary shadow-xl flex items-center">
                <div className="p-2">
                    <h3 className="uppercase">
                        Image Collections
                    </h3>
                    <span className="text-xs uppercase text-lightSecondary">
                        Cru Scanlan Photography
                    </span>
                </div>
                <div className="relative flex items-baseline pl-4">
                    {
                        props.collections.map((collection: any) => (
                            <div className="p-2 text-lightSecondary hover:text-lightPrimary" key={collection.slug}>
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
                    targetRowHeight={600}
                    breakpoints={[320, 640, 768, 1024, 1280, 1536]}
                />
            </div>
        </Layout>
    )
};

export default Gallery;
 
export async function getStaticProps({ params }) {
    const photoCollectionSlug = params.photoCollectionSlug;
    //{include: 2, content_type: ''}

    const photoCollectionOrderContentful = await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2}); //{include: 2} will make sure it retreieves linked assets 2 deep

    const collections = photoCollectionOrderContentful.fields.photoCollections.map(item => ({name: item.fields.name, slug: item.fields.slug})) //Name and slug

    const collection = photoCollectionOrderContentful.fields.photoCollections.find(photoCollection => photoCollection.fields.slug === photoCollectionSlug).fields;
    const heroImage = collection.heroImage.fields;
    const landscapeImages = collection.images.map(image => image.fields);

    return {
        props: {
            slug: photoCollectionSlug,
            heroImage,
            collections,
            landscapeImages
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