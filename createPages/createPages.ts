import { GatsbyNode } from "gatsby";
import { createGalleryPhotoCollectionPages } from '.';

export const createPages: GatsbyNode["createPages"] = async ({
        graphql,
        actions,
    }) => {
    const { createPage } = actions;
  
    await createGalleryPhotoCollectionPages(createPage, graphql);
}