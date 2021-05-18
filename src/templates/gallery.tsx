import React, { useCallback } from 'react';
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ReactPhotoGallery, { RenderImageProps, renderImageClickHandler } from "react-photo-gallery";
import useWindowSize from 'hooks/useWindowSize';

import Layout from 'components/Layout/Layout';

import './gallery.css';

interface IRenderGalleryImageProps {
    src?: string;
    file: any;
    title: string;
}

const RenderGalleryImage: React.FC<RenderImageProps<IRenderGalleryImageProps> & {masonry: boolean}> = ({ photo, margin, top, left, index, onClick, masonry = true }) => {
    let image = getImage(photo.file);

    const handleClick = (e: React.MouseEvent) => {
        if(onClick) onClick(e, {...photo, index});
    }

    if(!image) return <div>Error Getting Image</div>;

    return (
        <div className="w-full relative hover:" style={masonry ? {margin, width: photo.width, height: photo.height, top, left} : {}} key={photo.key} onClick={handleClick}>
            <div className="w-full h-full absolute z-20 flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100">
                <div className="galleryImage p-2 w-full bg-opacity-80 bg-gray-800">
                    <h3 className="text-white font">
                        { photo.title }
                    </h3>
                </div>
            </div>
            <GatsbyImage key={photo.key} className="galleryImage__gatsby w-full h-full absolute" image={image} alt="Image" loading={index < 5 ? 'eager' : 'lazy'} />
        </div>
    )
}

const GalleryPage: React.FC = (props: any) => {

    const { width: windowWidth } = useWindowSize();

    const photos: IGalleryPhotoData[] = props.pageContext.images.map((image: any) => {
        const fullImage = image.fullResImage;

        return {
            key: image.id,
            src: '',
            width: fullImage.file.details.image.width,
            height: fullImage.file.details.image.height,
            file: fullImage.gatsbyImageData,
            title: image.title
        }
    });

    const onPhotoClick = useCallback<renderImageClickHandler>((e, photo) => {
    }, [])

    return (
        <Layout pageTitle={'Gallery | Cru Scanlan Photography'} pageClass="p-gallery top" padTop={true}>
            <div className="bg-gray-800 p-4">
                {
                    !windowWidth || windowWidth >= 600 && //Desktop masonry
                    <ReactPhotoGallery 
                        photos={photos} 
                        renderImage={RenderGalleryImage as any}
                        onClick={onPhotoClick}
                        targetRowHeight={450} 
                        limitNodeSearch={4}
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
                        />
                    )
                }
            </div>
        </Layout>
    )
};

export default GalleryPage;