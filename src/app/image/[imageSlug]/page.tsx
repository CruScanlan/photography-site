import contentful from 'utils/contentful';
import { Suspense } from 'react';
import { generateTinyPlaceholder } from 'utils/generate-placeholder';
import ImageClient from './image-client';

type IPhotoCollectionSlugs = {
    slug: string;
    images: string[]
};

// Build-time memoized fetch so every static page (and its generateMetadata)
// in a build worker shares a single pair of Contentful calls instead of
// re-fetching the full image set per page.
let _contentfulPromise: Promise<{ photoCollections: IPhotoCollectionSlugs[]; bySlug: Map<string, any> }> | null = null;

function loadContentful() {
    if (!_contentfulPromise) {
        _contentfulPromise = (async () => {
            const [photoCollectionOrderContentful, landscapeImagesContentful] = await Promise.all([
                contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', { include: 2 }),
                contentful.getEntries<any>({ include: 1, content_type: 'landscapeImage' })
            ]);

            const photoCollections: IPhotoCollectionSlugs[] = photoCollectionOrderContentful.fields.photoCollections.map((item: any) => ({
                slug: item.fields.slug,
                images: item.fields.images.map((image: any) => image.fields.slug)
            }));

            const bySlug = new Map<string, any>(
                landscapeImagesContentful.items.map((item: any) => [item.fields.slug, item.fields])
            );

            return { photoCollections, bySlug };
        })();
    }
    return _contentfulPromise;
}

// Trim a neighbour image down to only what the client needs (preload src +
// intrinsic dimensions) so the static payload stays small even when an image
// belongs to several collections.
function trimNeighbour(fields: any) {
    const file = fields.fullResImage.fields.file;
    return {
        slug: fields.slug,
        fullResImage: {
            fields: {
                file: {
                    url: file.url,
                    details: { image: { width: file.details.image.width, height: file.details.image.height } }
                }
            }
        }
    };
}

type NavEntry = {
    nextImageSlug: string;
    previousImageSlug: string;
    nextImage: any;
    previousImage: any;
};

async function getImageData(imageSlug: string) {
    const { photoCollections, bySlug } = await loadContentful();

    const image = bySlug.get(imageSlug);
    if (!image) {
        throw new Error(`Image with slug "${imageSlug}" not found`);
    }

    // Pre-compute next/previous for every collection this image belongs to, so
    // the client can resolve collection-specific navigation from ?collection=
    // without any request-time data fetching.
    const navByCollection: Record<string, NavEntry> = {};
    let defaultCollectionSlug = '';

    for (const collection of photoCollections) {
        const idx = collection.images.findIndex((slug) => slug === imageSlug);
        if (idx === -1) continue;

        if (defaultCollectionSlug === '') defaultCollectionSlug = collection.slug;

        const nextSlug = collection.images[idx + 1 !== collection.images.length ? idx + 1 : 0];
        const prevSlug = collection.images[idx !== 0 ? idx - 1 : collection.images.length - 1];

        navByCollection[collection.slug] = {
            nextImageSlug: nextSlug,
            previousImageSlug: prevSlug,
            nextImage: trimNeighbour(bySlug.get(nextSlug) ?? image),
            previousImage: trimNeighbour(bySlug.get(prevSlug) ?? image)
        };
    }

    // Fallback for an image that isn't in any collection: arrows reference the
    // image itself so the page still renders (matches old behaviour of not
    // crashing, but statically).
    if (defaultCollectionSlug === '') {
        navByCollection[''] = {
            nextImageSlug: imageSlug,
            previousImageSlug: imageSlug,
            nextImage: trimNeighbour(image),
            previousImage: trimNeighbour(image)
        };
    }

    // Generated at build time (this route is SSG), so the blur placeholder
    // costs nothing at request time. Tiny (20px) source keeps generation fast.
    const base64 = await generateTinyPlaceholder(`https:${image.fullResImage.fields.file.url}`);

    return { image, base64, navByCollection, defaultCollectionSlug };
}

export async function generateStaticParams() {
    const { bySlug } = await loadContentful();
    return Array.from(bySlug.keys()).map((imageSlug) => ({ imageSlug }));
}

export default async function GalleryPhotoPage({ params }: { params: Promise<{ imageSlug: string }> }) {
    const { imageSlug } = await params;
    const { image, base64, navByCollection, defaultCollectionSlug } = await getImageData(imageSlug);

    return (
        // useSearchParams() in ImageClient requires a Suspense boundary; this
        // keeps the route statically prerendered while the collection-specific
        // navigation resolves on the client.
        <Suspense fallback={<div className="w-screen h-screen bg-darkPrimary" />}>
            <ImageClient
                image={image}
                base64={base64}
                navByCollection={navByCollection}
                defaultCollectionSlug={defaultCollectionSlug}
            />
        </Suspense>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ imageSlug: string }> }) {
    const { imageSlug } = await params;
    const { bySlug } = await loadContentful();
    const image = bySlug.get(imageSlug);

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
