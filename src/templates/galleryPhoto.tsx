import React, { useCallback } from 'react';
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useQueryParam, StringParam } from "use-query-params";

import Layout from 'components/Layout/Layout';

type IPhotoCollectionSlugs = {
    slug: string;
    images: {
        slug: string
    }[]
};

type IPhotoCollectionsSlugsArray = IPhotoCollectionSlugs[];

const GalleryPhotoPage: React.FC = (props: any) => {
    const image = getImage(props.pageContext.fullResImage.gatsbyImageData);

    console.log(image)

    const [collectionQueryParam] = useQueryParam("collection", StringParam);
    let collectionSlug: string = '';
    let nextImageSlug: string = '';
    let previousImageSlug: string = '';

    const getOtherImagesFromCollection = (collection: IPhotoCollectionSlugs) => {
        const imageIndex = collection.images.findIndex(({ slug }) => slug === props.pageContext.slug);
        if(imageIndex === -1) return ['', '', '']; //Didnt find image in collection

        const collectionSlug = collection.slug;
        const nextImageSlug = collection.images[imageIndex+1 !== collection.images.length ? imageIndex+1 : 0].slug;
        const previousImageSlug = collection.images[imageIndex !== 0 ? imageIndex-1 : collection.images.length-1].slug;

        return [collectionSlug, nextImageSlug, previousImageSlug];
    }

    const photoCollectionsSlugs:IPhotoCollectionsSlugsArray = props.pageContext.photoCollectionsSlugs;
    if(collectionQueryParam && collectionQueryParam !== '') {
        for(let i=0; i<photoCollectionsSlugs.length; i++) {
            const collection = photoCollectionsSlugs[i];

            if(collectionQueryParam === collection.slug) { //Found collection
                [collectionSlug, nextImageSlug, previousImageSlug] = getOtherImagesFromCollection(collection);
            }
        }
    }

    if(collectionSlug === '') {
        for(let i=0; i<photoCollectionsSlugs.length; i++) {
            const collection = photoCollectionsSlugs[i];
            const hasImage = collection.images.findIndex(({ slug }) => slug === props.pageContext.slug) !== -1;

            if(hasImage) { //Found set and break loop
                [collectionSlug, nextImageSlug, previousImageSlug] = getOtherImagesFromCollection(collection);
                break;
            }
        }
        //Didnt find anything
        console.error(`ERROR: Didnt find a collection this image belongs to`);
    }

    return (
        <Layout
            pageTitle={`${props.pageContext.title} | Cru Scanlan Photography`} 
            pageClass="bg-bg1"
            fullPage={true}
        >
            <div className="w-screen h-screen flex justify-center items-center">
                {
                    image && <GatsbyImage className="max-w-[90vw] max-h-[90vh]" loading="eager" image={image} objectFit="contain" alt="Image" />
                }
                {
                    !image && <div className="text-textPrimary">Could not find Image</div>
                }
            </div>
            <div className="text-textPrimary">
                <Link to={`/${nextImageSlug}?collection=${collectionSlug}`}>
                    Next Image
                </Link>
                <br />
                <Link to={`/${previousImageSlug}?collection=${collectionSlug}`}>
                    Previous Image
                </Link>
                <br />
                <Link to={`/${collectionSlug}`}>
                    Back
                </Link>
            </div>
        </Layout>
    )
};

export default GalleryPhotoPage;