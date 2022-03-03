import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PhotoAlbum, { PhotoProps } from "react-photo-album";
import { getPlaiceholder } from "plaiceholder";
import contentful from 'utils/contentful';

import Layout from 'components/Layout/Layout';
import NavLink from 'components/NavLink/NavLink';

type IRenderGalleryImageProps  = PhotoProps<{
    src: string;
    width: number;
    height: number;
    imageSlug: string;
    collectionSlug: string;
    base64: string;
}> & { wrapperProps?: React.HTMLAttributes<HTMLDivElement>; };

const RenderGalleryImage: React.FC<IRenderGalleryImageProps> = ({ photo, imageProps, wrapperProps }) => {
    const { width, height, imageSlug, collectionSlug, base64 } = photo;
    const { src, alt, title, style} = imageProps;
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
                placeholder="blur"
                blurDataURL={base64}
            />
        </div>
    )
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
                    placeholder='blur'
                    blurDataURL={props.heroImage.file.base64}
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
    };

    let landscapeImagesContentful = collection.images.map(image => image.fields);
    let landscapeImages = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) {

        landscapeImagesContentful[i].fullResImage.fields.file = {
            ...landscapeImagesContentful[i].fullResImage.fields.file,
            base64: (await getPlaiceholder(`https:${landscapeImagesContentful[i].fullResImage.fields.file.url}`)).base64
        };

        landscapeImages.push(landscapeImagesContentful[i]);
    }

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