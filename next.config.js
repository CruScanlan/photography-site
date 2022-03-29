const { withPlaiceholder } = require("@plaiceholder/next");

module.exports = withPlaiceholder({
    images: {
        formats: ['image/webp'],
        domains: ['images.ctfassets.net', 'downloads.ctfassets.net'],
        deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
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
});