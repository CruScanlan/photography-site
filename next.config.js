module.exports = {
    images: {
        domains: ['images.ctfassets.net', 'downloads.ctfassets.net'],
    },
    async redirects() {
      return [
        {
          source: '/gallery',
          destination: '/gallery/personal-favourites',
          permanent: true
        }
      ]
    }
}