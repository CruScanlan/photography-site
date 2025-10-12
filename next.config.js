/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net'
            },
            {
                protocol: 'https',
                hostname: 'downloads.ctfassets.net'
            }
        ],
        deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000, // Cache images for 1 year (seconds)
        dangerouslyAllowSVG: false,
        contentDispositionType: 'inline',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    async redirects() {
        return [
            {
                source: '/gallery',
                destination: '/gallery/personal-favourites',
                permanent: true
            },
            {
                source: '/image',
                destination: '/gallery/personal-favourites',
                permanent: true
            }
        ]
    }
};

module.exports = nextConfig;