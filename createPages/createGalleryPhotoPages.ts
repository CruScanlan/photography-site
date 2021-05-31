import { Actions, CreatePagesArgs } from 'gatsby';
import * as path from "path";

export const createGalleryPhotoPages = async (createPage: Actions['createPage'], graphql: CreatePagesArgs['graphql']) => {
    const { data } = await graphql(`
        query {
            allContentfulLandscapeImage {
                edges {
                    node {
                        id
                        slug
                        title
                        location
                        description {
                            description
                        }
                        fullResImage {
                            gatsbyImageData(
                                quality: 100
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                                layout: CONSTRAINED
                                height: 2200
                                outputPixelDensities: [0.25, 0.5, 0.75, 1, 2]
                            )
                            file {
                                details {
                                    image {
                                        height
                                        width
                                    }
                                }
                            }
                        }
                    }
                }
            }
            contentfulPhotoCollectionOrder {
                photoCollections {
                    slug
                    images {
                        slug
                    }
                }
            }
        }
    `) as any;

    data.allContentfulLandscapeImage.edges.forEach((edge: any) => {
        const slug = edge.node.slug;
        if(!slug) return console.error(`Could not find slug for Gallery Photo Node with name: ${edge.node.title}`);

        createPage({
            path: slug,
            component: path.resolve('./src/templates/galleryPhoto.tsx'),
            context: {
                photoCollectionsSlugs: data.contentfulPhotoCollectionOrder.photoCollections,
                ...edge.node
            }
        });
    });
}