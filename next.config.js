/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/webp'],
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
        loader: 'custom',
        loaderFile: './src/utils/image-loader.ts'
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