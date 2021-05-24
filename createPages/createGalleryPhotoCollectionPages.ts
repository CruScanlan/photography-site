import { Actions, CreatePagesArgs } from 'gatsby';
import * as path from "path";

export const createGalleryPhotoCollectionPages = async (createPage: Actions['createPage'], graphql: CreatePagesArgs['graphql']) => {
    const { data } = await graphql(`
        query {
            photoCollections: allContentfulPhotoCollection {
                edges {
                    node {
                        name
                        id
                        slug
                        heroImage {
                            gatsbyImageData(
                                quality: 100
                                placeholder: BLURRED
                                formats: [AUTO, WEBP]
                            )
                        }
                        images {
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
                                gatsbyImageData(
                                    quality: 100
                                    placeholder: BLURRED
                                    formats: [AUTO, WEBP]
                                    height: 600
                                    layout: CONSTRAINED
                                )
                            }
                        }
                    }
                }
            }
        }
    `) as any

    const collectionNames = data.photoCollections.edges.map((edge: any) => {
        return {
            name: edge.node.name,
            slug: edge.node.slug
        }
    })

    data.photoCollections.edges.forEach((edge: any) => {
        const slug = edge.node.slug;
        if(!slug) return console.error(`Could not find slug for Gallery Node`);
    
        createPage({
            path: slug,
            component: path.resolve('./src/templates/galleryPhotoCollection.tsx'),
            context: {
                collectionNames,
                ...edge.node
            }
        });
    });
}