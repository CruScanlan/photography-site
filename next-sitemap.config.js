/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://cruscanlan.com',
    generateRobotsTxt: true, // (optional)
    sitemapSize: 7000,
    // Exclude server-generated sitemap and all store pages (store is disabled)
    exclude: [
        '/server-sitemap.xml',
        '/store',
        '/store/*',
    ],
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://cruscanlan.com/server-sitemap-index.xml', // <==== Add here
        ],
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/store'], // Disallow store pages in robots.txt
            },
        ],
    },
}