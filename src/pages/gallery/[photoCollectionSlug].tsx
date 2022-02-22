import React, { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactPhotoGallery, { RenderImageProps, renderImageClickHandler } from "react-photo-gallery";
import useWindowSize from 'hooks/useWindowSize';
import contentful from 'utils/contentful';

import Layout from 'components/Layout/Layout';
import NavLink from 'components/NavLink/NavLink';

interface IRenderGalleryImageProps {
    key: string;
    url: string;
    title: string;
    width: string;
    height: string;
    imageSlug: string;
    collectionSlug: string;
}

const rowHeight = 600;

const RenderGalleryImage: React.FC<RenderImageProps<IRenderGalleryImageProps> & {masonry: boolean}> = ({ photo, margin, top, left, index, onClick, masonry = true }) => {
    const handleClick = (e: React.MouseEvent) => {
        if(onClick) onClick(e, {...photo, index});
    }

    if(!photo) return <div>Error Getting Image</div>;

    return (
        <div className="w-full relative" style={masonry ? {margin, width: photo.width, height: photo.height, top, left} : {}} key={photo.key} onClick={handleClick}>
            <Link href={`/${photo.imageSlug}?collection=${photo.collectionSlug}`}>
                <div className="w-full h-full z-10 absolute flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100">
                    <div className="c-galleryImage p-2 w-full bg-opacity-80 bg-darkSecondary">
                        <h4 className="text-lightPrimary font">
                            { photo.title }
                        </h4>
                    </div>
                </div>
            </Link>
            <Image className="c-galleryImage__gatsby w-full h-full absolute" quality={98} src={photo.url} width={photo.width} height={photo.height} layout="responsive" alt="Image" loading={index < 5 ? 'eager' : 'lazy'} />
        </div>
    )
}

const Gallery = (props) => {
    const { width: windowWidth } = useWindowSize();

    const photos = props.landscapeImages.map((landscapeImage: any) => {
        const image = landscapeImage.fullResImage.fields;

        return {
            key: landscapeImage.slug,
            url: `https:${image.file.url}`,
            width: image.file.details.image.width,
            height: image.file.details.image.height,
            title: landscapeImage.title,
            imageSlug: landscapeImage.slug,
            collectionSlug: props.slug
        }
    });

    const onPhotoClick = useCallback<renderImageClickHandler>((e, photo) => {
        
    }, [])

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
                {
                    !windowWidth || windowWidth >= rowHeight && //Desktop masonry
                    <ReactPhotoGallery 
                        photos={photos} 
                        renderImage={RenderGalleryImage as any}
                        onClick={onPhotoClick}
                        targetRowHeight={rowHeight} 
                        margin={4}
                        //limitNodeSearch={findIdealNodeSearch({targetRowHeight: rowHeight, containerWidth: windowWidth})}
                    />
                }
                {
                    windowWidth && windowWidth < rowHeight && //Mobile list
                    photos.map((photo: any, index) => 
                        <RenderGalleryImage 
                            photo={photo} 
                            onClick={onPhotoClick} 
                            index={index} 
                            direction="row"
                            masonry={false}
                            key={photo.key}
                        />
                    )
                }
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