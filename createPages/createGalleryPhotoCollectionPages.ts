import { Actions, CreatePagesArgs } from 'gatsby';
import * as path from "path";

export const createGalleryPhotoCollectionPages = async (createPage: Actions['createPage'], graphql: CreatePagesArgs['graphql']) => {
    const { data } = await graphql(`
        query {
            contentfulPhotoCollectionOrder {
                photoCollections {
                    name
                    id
                    slug
                    heroImage {
                        gatsbyImageData(
                            quality: 100
                            placeholder: BLURRED
                            formats: [AUTO, WEBP]
                            width: 2500
                        )
                    }
                    images {
                        id
                        title
                        slug
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
                                height: 700
                                layout: CONSTRAINED
                            )
                        }
                    }
                }
            }
        }
    `) as any

    const collectionNames = data.contentfulPhotoCollectionOrder.photoCollections.map((photoCollection: any) => {
        return {
            name: photoCollection.name,
            slug: photoCollection.slug
        }
    })

    data.contentfulPhotoCollectionOrder.photoCollections.forEach((photoCollection: any) => {
        const slug = photoCollection.slug;
        if(!slug) return console.error(`Could not find slug for Gallery Collection Node with name: ${photoCollection.name}`);
    
        createPage({
            path: slug,
            component: path.resolve('./src/templates/galleryPhotoCollection.tsx'),
            context: {
                collectionNames,
                ...photoCollection
            }
        });
    });
}