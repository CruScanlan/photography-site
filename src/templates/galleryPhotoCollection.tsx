import React, { useCallback } from 'react';
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ReactPhotoGallery, { RenderImageProps, renderImageClickHandler } from "react-photo-gallery";
import useWindowSize from 'hooks/useWindowSize';

import Layout from 'components/Layout/Layout';

import './galleryPhotoCollection.css';

interface IRenderGalleryImageProps {
    src?: string;
    file: any;
    title: string;
    imageSlug: string;
    collectionSlug: string;
}

const RenderGalleryImage: React.FC<RenderImageProps<IRenderGalleryImageProps> & {masonry: boolean}> = ({ photo, margin, top, left, index, onClick, masonry = true }) => {
    let image = getImage(photo.file);

    const handleClick = (e: React.MouseEvent) => {
        if(onClick) onClick(e, {...photo, index});
    }

    if(!image) return <div>Error Getting Image</div>;

    return (
        <div className="w-full relative" style={masonry ? {margin, width: photo.width, height: photo.height, top, left} : {}} key={photo.key} onClick={handleClick}>
            <Link to={`/${photo.imageSlug}?collection=${photo.collectionSlug}`}>
                <div className="w-full h-full z-10 absolute flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100">
                    <div className="c-galleryImage p-2 w-full bg-opacity-80 bg-bg2">
                        <h4 className="text-textPrimary font">
                            { photo.title }
                        </h4>
                    </div>
                </div>
            </Link>
            <GatsbyImage key={photo.key} className="c-galleryImage__gatsby w-full h-full absolute" image={image} alt="Image" loading={index < 5 ? 'eager' : 'lazy'} />
        </div>
    )
}

/* const round = (value: number, decimals?: number) => {
    if (!decimals) decimals = 0;
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

const findIdealNodeSearch = ({ targetRowHeight, containerWidth }: {targetRowHeight: number, containerWidth: number}) => {
    const rowAR = containerWidth / targetRowHeight;
    return round(rowAR / 1.5)+8;
}; */

const GalleryPhotoCollectionPage: React.FC = (props: any) => {

    const { width: windowWidth } = useWindowSize();

    const photos: IGalleryPhotoData[] = props.pageContext.images.map((image: any) => {
        const fullImage = image.fullResImage;

        return {
            key: image.id,
            src: '',
            width: fullImage.file.details.image.width,
            height: fullImage.file.details.image.height,
            file: fullImage.gatsbyImageData,
            title: image.title,
            imageSlug: image.slug,
            collectionSlug: props.pageContext.slug
        }
    });

    const onPhotoClick = useCallback<renderImageClickHandler>((e, photo) => {
        
    }, [])

    return (
        <Layout 
            pageTitle={'Gallery | Cru Scanlan Photography'} 
            pageClass="p-gallery bg-bg2" 
            navbarScrollAnimation={{
                enabled: true,
                startPositonRelative: 0.2,
                startPositionAbsolute: 25,
                endPositionRelative: 0.4,
                endPositionAbsolute: 120
            }}
        >
            <div className="w-full h-[60vh]">
                <GatsbyImage className="w-full h-[60vh] !fixed" image={props.pageContext.heroImage.gatsbyImageData} alt="Image" loading={'eager'} />   
            </div>
            <div className="w-full relative p-4 text-textPrimary bg-bg1 shadow-xl flex items-center">
                <div className="p-2">
                    <h3 className="uppercase">
                        Image Collections
                    </h3>
                    <span className="text-xs uppercase text-textSecondary">
                        Cru Scanlan Photography
                    </span>
                </div>
                <div className="relative flex items-baseline pl-4">
                    {
                        props.pageContext.collectionNames.map((collectionName: any) => (
                            <div className="p-2">
                                <Link className="text-textSecondary hover:text-textPrimary" activeClassName="!text-textPrimary" to={`/${collectionName.slug}`}>
                                    <h4>
                                        {collectionName.name}
                                    </h4>
                                </Link>
                            </div>
                        ))
                    }     
                </div>
            </div>
            <div className="relative p-4 bg-bg2">
                {
                    !windowWidth || windowWidth >= 600 && //Desktop masonry
                    <ReactPhotoGallery 
                        photos={photos} 
                        renderImage={RenderGalleryImage as any}
                        onClick={onPhotoClick}
                        targetRowHeight={600} 
                        margin={4}
                    />
                }
                {
                    windowWidth && windowWidth < 600 && //Mobile list
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

export default GalleryPhotoCollectionPage;