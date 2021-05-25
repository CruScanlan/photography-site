import { GatsbyNode } from "gatsby";
import { createGalleryPhotoCollectionPages, createGalleryPhotoPages } from '.';

export const createPages: GatsbyNode["createPages"] = async ({
        graphql,
        actions,
    }) => {
    const { createPage, createRedirect } = actions;
  
    await createGalleryPhotoCollectionPages(createPage, graphql);

    await createGalleryPhotoPages(createPage, graphql);

    createRedirect({ fromPath: '/gallery', toPath: '/personal-favourites', statusCode: 200, isPermanent: true, redirectInBrowser: true });
}