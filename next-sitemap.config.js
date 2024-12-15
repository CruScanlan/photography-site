/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://cruscanlan.com',
    generateRobotsTxt: true, // (optional)
    sitemapSize: 7000,
    exclude: ['/server-sitemap.xml'], // <= exclude here
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://cruscanlan.com/server-sitemap.xml', // <==== Add here
        ],
    },
}