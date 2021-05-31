import React, { useRef } from 'react';
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useQueryParam, StringParam } from "use-query-params";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import useWindowSize from 'hooks/useWindowSize';
import useComponentSize from '@rehooks/component-size'


import Layout from 'components/Layout/Layout';
import Button from 'components/Button/Button';

type IPhotoCollectionSlugs = {
    slug: string;
    images: {
        slug: string
    }[]
};

type IPhotoCollectionsSlugsArray = IPhotoCollectionSlugs[];

const GalleryPhotoPage: React.FC = (props: any) => {
    const slug: string = props.pageContext.slug;

    const image = getImage(props.pageContext.fullResImage.gatsbyImageData);
    const imageDimensions: {width: number; height: number} = props.pageContext.fullResImage.file.details.image;


    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const imageInfoSizeRef = useRef(null);
    const imageInfoSize = useComponentSize(imageInfoSizeRef)

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
        let found = false;
        for(let i=0; i<photoCollectionsSlugs.length; i++) {
            const collection = photoCollectionsSlugs[i];
            const hasImage = collection.images.findIndex(({ slug }) => slug === props.pageContext.slug) !== -1;

            if(hasImage) { //Found set and break loop
                [collectionSlug, nextImageSlug, previousImageSlug] = getOtherImagesFromCollection(collection);
                found = true;
                break;
            }
        }
        if(!found) {
            //Didnt find anything
            console.error(`ERROR: Didnt find a collection this image belongs to for ${props.pageContext.slug}`);
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
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div style={{width, height}} className="flex flex-col items-center">
                    {
                        image && <GatsbyImage loading="eager" image={image} alt="Image" />
                    }
                    {
                        !image && <div className="text-textPrimary">Could not find Image</div>
                    }
                    
                </div>
                <div style={{width}} className="mt-2 flex flex-col justify-between items-center md:flex-row" ref={imageInfoSizeRef}>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-textPrimary">{props.pageContext.title}</h3>
                        <span className="text-sm text-textSecondary">{props.pageContext.location}</span>
                    </div>
                    <Button size="md" classes="mt-2 md:m-0 md:ml-2" to={`/store/prints/${slug}`}>BUY PRINT</Button>
                </div>
            </div>
        </Layout>
    )
};

export default GalleryPhotoPage;