import contentful from 'utils/contentful';
import ImageClient from './image-client';

type IPhotoCollectionSlugs = {
    slug: string;
    images: string[]
};

type IPhotoCollectionsSlugsArray = IPhotoCollectionSlugs[];

type IImageDimensions = {width: number; height: number};

export default async function GalleryPhotoPage({ params, searchParams }: { params: Promise<{ imageSlug: string }>, searchParams: Promise<{ collection?: string }> }) {
    const { imageSlug } = await params;
    const { collection: collectionQueryParam } = await searchParams;

    let [photoCollectionOrderContentful, landscapeImagesContentful] = await Promise.all([
        contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2}),
        contentful.getEntries<any>({include: 1, content_type: 'landscapeImage'})
    ]);

    const landscapeImages = landscapeImagesContentful.items;

    const photoCollectionSlugs: IPhotoCollectionsSlugsArray = photoCollectionOrderContentful.fields.photoCollections.map(item => ({
        slug: item.fields.slug,
        images: item.fields.images.map(image => image.fields.slug)
    }));

    const foundImage = landscapeImages.find(landscapeImage => landscapeImage.fields.slug === imageSlug);
    if (!foundImage) {
        throw new Error(`Image with slug "${imageSlug}" not found`);
    }
    let image = foundImage.fields;

    let collectionSlug: string = '';
    let nextImageSlug: string = '';
    let previousImageSlug: string = '';

    const getOtherImagesFromCollection = (collection: IPhotoCollectionSlugs) => {
        const imageIndex = collection.images.findIndex((slug) => slug === imageSlug);
        if(imageIndex === -1) return ['', '', '']; //Didnt find image in collection

        const collectionSlug = collection.slug;
        const nextImageSlug = collection.images[imageIndex+1 !== collection.images.length ? imageIndex+1 : 0];
        const previousImageSlug = collection.images[imageIndex !== 0 ? imageIndex-1 : collection.images.length-1];

        return [collectionSlug, nextImageSlug, previousImageSlug];
    }

    if(collectionQueryParam && collectionQueryParam !== '') {
        for(let i=0; i<photoCollectionSlugs.length; i++) {
            const collection = photoCollectionSlugs[i];

            if(collectionQueryParam === collection.slug) { //Found collection
                [collectionSlug, nextImageSlug, previousImageSlug] = getOtherImagesFromCollection(collection);
                break;
            }
        }
    }

    if(collectionSlug === '') {
        let found = false;
        for(let i=0; i<photoCollectionSlugs.length; i++) {
            const collection = photoCollectionSlugs[i];
            const hasImage = collection.images.findIndex((slug) => slug === imageSlug) !== -1;

            if(hasImage) { //Found set and break loop
                [collectionSlug, nextImageSlug, previousImageSlug] = getOtherImagesFromCollection(collection);
                found = true;
                break;
            }
        }
        if(!found) {
            //Didnt find anything
            console.error(`ERROR: Didnt find a collection this image belongs to for ${imageSlug}`);
        }
    }

    const foundNextImage = landscapeImages.find(landscapeImage => landscapeImage.fields.slug === nextImageSlug);
    const foundPreviousImage = landscapeImages.find(landscapeImage => landscapeImage.fields.slug === previousImageSlug);
    
    if (!foundNextImage || !foundPreviousImage) {
        throw new Error(`Adjacent images not found`);
    }
    
    const nextImage = foundNextImage.fields;
    const previousImage = foundPreviousImage.fields;

    return (
        <ImageClient 
            image={image}
            collectionSlug={collectionSlug}
            nextImageSlug={nextImageSlug}
            nextImage={nextImage}
            previousImageSlug={previousImageSlug}
            previousImage={previousImage}
        />
    );
}

export async function generateMetadata({ params }: { params: Promise<{ imageSlug: string }> }) {
    const { imageSlug } = await params;
    const landscapeImagesContentful = await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage'});
    const image = landscapeImagesContentful.items.find(item => item.fields.slug === imageSlug)?.fields;
    
    return {
        title: `${image?.title || 'Image'} | Cru Scanlan Photography`,
        openGraph: {
            title: `${image?.title || 'Image'} | Cru Scanlan Photography`,
            url: `https://cruscanlan.com/image/${imageSlug}`,
            images: image?.fullResImage?.fields?.file?.url ? [{
                url: `https:${image.fullResImage.fields.file.url}?w=1080&q=95`,
            }] : []
        }
    };
}

