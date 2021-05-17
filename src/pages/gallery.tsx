import React, { useCallback } from 'react';
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ReactPhotoGallery, { RenderImageProps } from "react-photo-gallery";
import useWindowSize from 'hooks/useWindowSize';

import Layout from 'components/Layout/Layout';

import './gallery.css';

interface IRenderGalleryImageProps {
    src?: string;
    filePreview: any;
    title: string;
}

const RenderGalleryImage: React.FC<RenderImageProps<IRenderGalleryImageProps> & {masonry: boolean}> = ({ photo, margin, top, left, masonry = true }) => {
    const image = getImage(photo.filePreview);

    if(!image) return <div>Error Getting Image</div>;
    return (
        <div className="w-full relative" style={masonry ? {margin, width: photo.width, height: photo.height, top, left} : {}} key={photo.key}>
            <div className="w-full h-full absolute z-20 flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100" style={masonry ? {width: photo.width, height: photo.height} : {}}>
                <div className="galleryImage p-2 w-full bg-opacity-80 bg-gray-800">
                    <h3 className="text-white font">
                        { photo.title }
                    </h3>
                </div>
            </div>
            <GatsbyImage key={photo.key} className="galleryImage__gatsby" image={image} alt="Image"/>
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
                                filePreview: localFile {
                                    childImageSharp {
                                        gatsbyImageData(
                                            quality: 90,
                                            placeholder: TRACED_SVG
                                            formats: [AUTO, WEBP]
                                            tracedSVGOptions: {
                                                color: "#171717",
                                                background: "#262626"
                                            }
                                        )
                                    }
                                }
                                fileFull: localFile {
                                    childImageSharp {
                                        gatsbyImageData(
                                            quality: 100,
                                            placeholder: TRACED_SVG
                                            formats: [AUTO, WEBP]
                                            tracedSVGOptions: {
                                                color: "#171717",
                                                background: "#262626"
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
    );

    const {width: windowWidth} = useWindowSize();

    const photos: any[] = landscapeImages.edges.map((edge: any) => {
        const fullImage = edge.node.fullResImage;

        return {
            key: edge.node.id,
            width: fullImage.file.details.image.width,
            height: fullImage.file.details.image.height,
            filePreview: fullImage.filePreview,
            fileFull: fullImage.fileFull,
            title: edge.node.title
        }
    });

    const onPhotoClick = useCallback(() => {

    }, [])

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
                        limitNodeSearch={4}
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