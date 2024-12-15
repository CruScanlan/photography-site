import { getServerSideSitemapLegacy } from 'next-sitemap'
import { GetServerSideProps } from 'next'
import contentful from 'utils/contentful';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Create sitemap entries with additional properties
    const sitemapEntries = [];
    
    //Get Image URLS
    const landscapeImages = await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage'});
    
    // Map URLs to sitemap entries with changefreq
    sitemapEntries.push(
        ...landscapeImages.items.map(item => ({
            loc: `https://cruscanlan.com/image/${item.fields.slug}`,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: item.sys.updatedAt
        }))
    );

    return getServerSideSitemapLegacy(ctx, sitemapEntries);
}

// Default export to prevent next.js errors
export default function SitemapIndex() {};