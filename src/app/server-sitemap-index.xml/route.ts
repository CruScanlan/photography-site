import { getServerSideSitemap } from 'next-sitemap';
import contentful from 'utils/contentful';

export async function GET() {
    // Get Image URLS
    const landscapeImages = await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage'});
    
    // Map URLs to sitemap entries
    const sitemapEntries = landscapeImages.items.map(item => ({
        loc: `https://cruscanlan.com/image/${item.fields.slug}`,
        changefreq: 'daily' as const,
        priority: 0.7,
        lastmod: item.sys.updatedAt
    }));

    return getServerSideSitemap(sitemapEntries);
}

