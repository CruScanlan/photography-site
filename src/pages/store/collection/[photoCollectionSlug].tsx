import contentful from 'utils/contentful';
import { getPlaiceholder } from "plaiceholder";

import createProductImage from 'utils/productImages/create';

import Store from 'components/Store';
export default Store;

export async function getStaticProps({ params }) {
    const photoCollectionSlug: string = params.photoCollectionSlug;
    
    const photoCollectionOrder = (await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 1})).fields.photoCollections.map(photoCollections => photoCollections.fields);

    const locations = (await contentful.getEntries<any>({include: 1, content_type: 'location'})).items.map(location => location.fields);

    const photoCollection = (await contentful.getEntries<any>({include: 2, content_type: 'photoCollection', 'fields.slug': photoCollectionSlug})).items[0].fields
    const landscapeImagesContentful = photoCollection.images.map(image => image.fields);

    /* const productImagesPromises = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) { //landscapeImagesContentful.length
        const landscapeImage = landscapeImagesContentful[i];
        const file = landscapeImage.fullResImage.fields.file;

        const imageUrl = `https:${file.url}`;
        productImagesPromises.push(createProductImage(imageUrl, file.fileName));
    } //Get product images

    const productImages = await Promise.all(productImagesPromises); */

    const landscapeImages = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) {
        const landscapeImageContentful = landscapeImagesContentful[i];
        if(!landscapeImageContentful.shop) continue; //Needs to be a shop image
        if(!landscapeImageContentful.shopProducts || landscapeImageContentful.shopProducts.length < 1) continue; //Needs to have a shop product attached

        const products = landscapeImagesContentful[i].shopProducts.map(shopProduct => shopProduct.fields).sort((first, second) => first.price - second.price); //Get products by acending price order

        landscapeImages.push({
            ...landscapeImageContentful,
            products,
            //productImage: productImages[i]
        });
    } //Get landscape images with product images

    const banner = await getPlaiceholder("/storeBanner.jpg");

    return {
        props: {
            photoCollectionOrder,
            storeDetails: {
                name: `${photoCollection.name} Collection Prints`,
                description: photoCollection.description || null,
                type: 'collection'
            },
            landscapeImages,
            locations,
            banner: {
                img: banner.img,
                base64: banner.base64
            }
        }
    }
}

export async function getStaticPaths() {
    const photoCollectionsContentful = await contentful.getEntries<any>({include: 1, content_type: 'photoCollection'})

    const collectionSlugs = photoCollectionsContentful.items.map(item => item.fields.slug) //Name and slug

    return {
        paths: collectionSlugs.map(collectionSlug => ({ params: { photoCollectionSlug: collectionSlug }})),
        fallback: false // false or 'blocking'
    };
}