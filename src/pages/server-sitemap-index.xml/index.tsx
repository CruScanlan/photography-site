import { getServerSideSitemapIndexLegacy } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import contentful from 'utils/contentful';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    let urls = [];
    //Get Image URLS
    const landscapeImages = await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage'});
    urls.push(...landscapeImages.items.map(item => `https://cruscanlan.com/image/${item.fields.slug}`));

    //Get gallery page URLS
    const galleryPage = await contentful.getEntry<any>('5MUgow4FEnQHKNRQI5p7Cr', {include: 2});
    urls.push(...galleryPage.fields.photoCollections.map(item => `https://cruscanlan.com/gallery/${item.fields.slug}`));

    return getServerSideSitemapIndexLegacy(ctx, urls);
}

// Default export to prevent next.js errors
export default function SitemapIndex() {};