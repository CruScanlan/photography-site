import React from 'react';
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ReactPhotoGallery, { RenderImageProps } from "react-photo-gallery";

import Layout from 'components/Layout/Layout';

import './gallery.css';

interface IRenderGalleryImageProps {
    localFile: any;
}

const RenderGalleryImage: React.FC<RenderImageProps<IRenderGalleryImageProps>> = ({ photo, margin, top, left }) => {
    const image = getImage(photo.localFile);

    if(!image) return <></>;
    return (
        <div style={{margin, width: photo.width, height: photo.height, top, left}}>
            <div className="absolute z-20 p-2 flex flex-row items-end" style={{width: photo.width, height: photo.height}}>
                <div className="">
                    <h3 className="text-white font">
                        Photo Title
                    </h3>
                </div>
            </div>
            <GatsbyImage className="galleryImage" key={photo.key} image={image} alt="Image" loading="eager"/>
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
                          localFile {
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

    const photos = landscapeImages.edges.map((edge: any) => {
        const fullImage = edge.node.fullResImage;

        return {
            key: edge.node.id,
            src: fullImage.localFile.childImageSharp.gatsbyImageData.images.fallback.src,
            width: fullImage.file.details.image.width,
            height: fullImage.file.details.image.height,
            localFile: fullImage.localFile
        }
    });

    return (
        <Layout pageTitle={'Gallery | Cru Scanlan Photography'} pageClass="p-gallery top" padTop={true}>
            <div style={{minHeight: 1100}} className="bg-gray-800 p-2">
                <ReactPhotoGallery photos={photos} renderImage={RenderGalleryImage as React.ComponentType<RenderImageProps<{}>>} targetRowHeight={450} limitNodeSearch={4}/>
            </div>
        </Layout>
    )
};

export default GalleryPage;