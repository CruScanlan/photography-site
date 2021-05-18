import { GatsbyNode } from "gatsby"
import * as path from "path"

export const createPages: GatsbyNode["createPages"] = async ({
    graphql,
    actions,
  }) => {
    const { createPage } = actions;
  
    const { data } = await graphql(`
        query {
            photoCollections: allContentfulPhotoCollection {
                edges {
                    node {
                        name
                        id
                        slug
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
                                    quality: 90, 
                                    placeholder: TRACED_SVG, 
                                    formats: [AUTO, WEBP]
                                )
                            }
                        }
                    }
                }
            }
        }
    `) as any

    data.photoCollections.edges.forEach((edge: any) => {
        const slug = edge.node.slug;
        if(!slug) return console.error(`Could not find slug for Gallery Node`);
    
        createPage({
            path: slug,
            component: path.resolve('./src/templates/gallery.tsx'),
            context: {
                ...edge.node
            }
        });
    });
  }