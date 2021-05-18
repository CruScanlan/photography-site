import React, { useCallback, useState } from 'react';
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ReactPhotoGallery, { RenderImageProps, renderImageClickHandler } from "react-photo-gallery";
import useWindowSize from 'hooks/useWindowSize';

import Layout from 'components/Layout/Layout';
import LightBox from 'components/LightBox/LightBox';

import './gallery.css';

interface IRenderGalleryImageProps {
    src?: string;
    filePreview: any;
    title: string;
}

const RenderGalleryImage: React.FC<RenderImageProps<IRenderGalleryImageProps> & {masonry: boolean}> = ({ photo, margin, top, left, index, onClick, masonry = true }) => {
    let image = getImage(photo.filePreview);

    const handleClick = (e: React.MouseEvent) => {
        if(onClick) onClick(e, {...photo, index});
    }

    if(!image) return <div>Error Getting Image</div>;
    image.width = photo.width;
    image.height = photo.height;

    return (
        <div className="w-full relative hover:" style={masonry ? {margin, width: photo.width, height: photo.height, top, left} : {}} key={photo.key} onClick={handleClick}>
            <div className="w-full h-full absolute z-20 flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100">
                <div className="galleryImage p-2 w-full bg-opacity-80 bg-gray-800">
                    <h3 className="text-white font">
                        { photo.title }
                    </h3>
                </div>
            </div>
            <GatsbyImage key={photo.key} className="galleryImage__gatsby" image={image} alt="Image" loading={index < 5 ? 'eager' : 'lazy'} />
        </div>
    )
}

const GalleryPage: React.FC = () => {
    const { landscapeImages } = useStaticQuery(
        graphql`
            query {
                landscapeImages: allContentfulLandscapeImage(filter: {}) {
                    edges {
                        node {
                            id
                            title
                            fullResImage {
                                file {
                                    details {
                                        image {
                                            width
                                            height
                                        }
                                    }
                                }
                                filePreview: gatsbyImageData(
                                            quality: 85
                                            placeholder: TRACED_SVG
                                            outputPixelDensities: [0.125, 0.25, 0.5, 1, 2]
                                            formats: [AUTO, WEBP]
                                )
                                fileFull: gatsbyImageData(
                                            quality: 100
                                            placeholder: TRACED_SVG
                                            formats: [AUTO, WEBP]
                                        )
                            }
                        }
                    }
                }
            }
        `,
    );

    const { width: windowWidth } = useWindowSize();
    const [lightBoxOpen, setLightBoxOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const photos: IGalleryPhotoData[] = landscapeImages.edges.map((edge: any) => {
        const fullImage = edge.node.fullResImage;

        return {
            key: edge.node.id,
            src: '',
            width: fullImage.file.details.image.width,
            height: fullImage.file.details.image.height,
            filePreview: fullImage.filePreview,
            fileFull: fullImage.fileFull,
            title: edge.node.title
        }
    });

    const onPhotoClick = useCallback<renderImageClickHandler>((e, photo) => {
        setCurrentPhotoIndex(photo.index);
        setLightBoxOpen(true);
    }, [setLightBoxOpen])

    return (
        <Layout pageTitle={'Gallery | Cru Scanlan Photography'} pageClass="p-gallery top" padTop={true}>
            <div style={{minHeight: 1100}} className="bg-gray-800 p-2">
                {
                    !windowWidth || windowWidth >= 600 && //Desktop masonry
                    <ReactPhotoGallery 
                        photos={photos} 
                        renderImage={RenderGalleryImage as any}
                        onClick={onPhotoClick}
                        targetRowHeight={450} 
                        limitNodeSearch={5}
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
            <LightBox
                photos={photos}
                currentPhotoIndex={currentPhotoIndex} 
                lightBoxOpen={lightBoxOpen} 
                setLightBoxOpen={setLightBoxOpen} 
            />
        </Layout>
    )
};

export default GalleryPage;