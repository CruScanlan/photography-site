const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Cru Scanlan Photography',
    description: '',
    siteUrl: 'https://cruscanlan.com'
  },
  plugins: [
    {
        resolve: 'gatsby-plugin-root-import',
        options: {
            "components": path.join(__dirname, "src/components"),
            "layouts": path.join(__dirname, "src/layouts"),
            "templates": path.join(__dirname, "src/templates"),
            "styles": path.join(__dirname, "src/styles"),
            "types": path.join(__dirname, "src/types"),
            "src": path.join(__dirname, 'src'),
            "pages": path.join(__dirname, 'src/pages')
        }
    },
    /* {
      resolve: "gatsby-source-shopify",
      options: {
        shopName: "cruscanlan.com",
        accessToken: "",
      },
    }, */
    "gatsby-plugin-postcss",
    "gatsby-plugin-image",
    /* {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "",
      },
    }, */
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};
