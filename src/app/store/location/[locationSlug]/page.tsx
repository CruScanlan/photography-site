import contentful from 'utils/contentful';
import { getPlaiceholder } from "plaiceholder";

import Store from 'components/Store';

export async function generateStaticParams() {
    const locationsContentful = await contentful.getEntries<any>({include: 1, content_type: 'location'});
    const locationSlugs = locationsContentful.items.map(item => item.fields.slug);

    return locationSlugs.map((slug) => ({
        locationSlug: slug,
    }));
}

export default async function StoreLocationPage({ params }: { params: Promise<{ locationSlug: string }> }) {
    const { locationSlug } = await params;

    const photoCollectionOrder = (await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 1})).fields.photoCollections.map(photoCollections => photoCollections.fields);
    const locations = (await contentful.getEntries<any>({include: 1, content_type: 'location'})).items.map(location => location.fields);

    const photoCollectionContentful = (await contentful.getEntries<any>({
        include: 2, 
        content_type: 'landscapeImage',
        'fields.location.sys.contentType.sys.id': 'location',
        'fields.location.fields.slug': locationSlug
    })).items;
    const landscapeImagesContentful = photoCollectionContentful.map(image => image.fields);   
    
    const location = locations.find(location => location.slug === locationSlug);

    const landscapeImages: any[] = [];
    for(let i=0; i<landscapeImagesContentful.length; i++) {
        const landscapeImageContentful = landscapeImagesContentful[i];
        if(!landscapeImageContentful.shop) continue; //Needs to be a shop image
        if(!landscapeImageContentful.shopProducts || landscapeImageContentful.shopProducts.length < 1) continue; //Needs to have a shop product attached

        const products = landscapeImagesContentful[i].shopProducts.map(shopProduct => shopProduct.fields).sort((first, second) => first.price - second.price); //Get products by acending price order

        landscapeImages.push({
            ...landscapeImageContentful,
            products,
        });
    } //Get landscape images with product images
    
    const banner = await getPlaiceholder("/storeBanner.jpg");

    return (
        <Store 
            photoCollectionOrder={photoCollectionOrder}
            storeDetails={{
                name: `${location!.name} Prints`,
                description: location!.description || null,
                type: 'location'
            }}
            landscapeImages={landscapeImages}
            locations={locations}
            banner={{
                img: banner.img,
                base64: banner.base64
            }}
        />
    );
}

export async function generateMetadata({ params }: { params: Promise<{ locationSlug: string }> }) {
    const { locationSlug } = await params;
    const locations = (await contentful.getEntries<any>({include: 1, content_type: 'location'})).items.map(location => location.fields);
    const location = locations.find(location => location.slug === locationSlug);
    
    return {
        title: `${location?.name || 'Location'} Prints | Cru Scanlan Photography`
    };
}

