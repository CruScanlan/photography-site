import React, { useCallback } from 'react';
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useQueryParam, StringParam } from "use-query-params";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';


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
            pageClass="bg-bg1 relative"
            fullPage={true}
        >
            <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center">
                <Link to={`/${previousImageSlug}?collection=${collectionSlug}`}>
                    <FontAwesomeIcon className="text-textTertiary hover:text-textPrimary" icon={faChevronLeft} size="2x" />
                </Link>
            </div>
            <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center right-0">
                <Link to={`/${nextImageSlug}?collection=${collectionSlug}`}>
                    <FontAwesomeIcon className="text-textTertiary hover:text-textPrimary" icon={faChevronRight} size="2x" />
                </Link>
            </div>
            <div className="absolute w-screen p-1 md:p-4 2xl:p-8 flex justify-end">
                <Link to={`/${collectionSlug}`}>
                    <FontAwesomeIcon className="text-textTertiary hover:text-textPrimary" icon={faTimes} size="2x" />
                </Link>
            </div>
            <div className="w-screen h-screen flex justify-center items-center">
                {
                    image && <GatsbyImage className="max-w-[90vw] max-h-[90vh] 2xl:max-w-[85vw] 2xl:max-h-[85vh]" loading="eager" image={image} objectFit="contain" alt="Image" />
                }
                {
                    !image && <div className="text-textPrimary">Could not find Image</div>
                }
            </div>
        </Layout>
    )
};

export default GalleryPhotoPage;