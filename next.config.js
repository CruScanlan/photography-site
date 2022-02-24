module.exports = {
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
        }
      ]
    }
}