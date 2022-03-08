const { withPlaiceholder } = require("@plaiceholder/next");

module.exports = withPlaiceholder({
    images: {
        formats: ['image/webp'],
        domains: ['images.ctfassets.net', 'downloads.ctfassets.net'],
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
        },
        {
            source: '/store',
            destination: '/store/collection/personal-favourites',
            permanent: true
        }
      ]
    }
});