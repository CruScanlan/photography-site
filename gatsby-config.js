require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})
process.env.GATSBY_CONCURRENT_DOWNLOAD = 1;
const path = require('path');

module.exports = {
    siteMetadata: {
        title: 'Cru Scanlan Photography',
        description: '',
        siteUrl: 'https://cruscanlan.com'
    },
    flags: {
        PRESERVE_WEBPACK_CACHE: true,
        PRESERVE_FILE_DOWNLOAD_CACHE: false,
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
                "pages": path.join(__dirname, 'src/pages'),
                "utils": path.join(__dirname, 'src/utils'),
                "hooks": path.join(__dirname, 'src/hooks')
            }
        },
        {
            resolve: `gatsby-source-contentful`,
            options: {
                spaceId: `x3lv0s4qe48t`,
                // Learn about environment variables: https://gatsby.dev/env-vars
                accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
                downloadLocal: false
            }
        },
        "gatsby-plugin-postcss",
        /* {
        resolve: "gatsby-plugin-google-analytics",
        options: {
            trackingId: "",
        },
        }, */
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-sitemap",
        /* {
        resolve: "gatsby-plugin-manifest",
        options: {
            icon: "src/images/icon.png",
        },
        }, */
        "gatsby-plugin-image",
        {
            resolve: 'gatsby-background-image-es5',
            options: {
                // add your own characters to escape, replacing the default ':/'
                specialChars: '/:',
            }
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
        `gatsby-plugin-transition-link`,
        `gatsby-plugin-use-query-params`,
        {
            resolve: `gatsby-plugin-modal-routing`,
            options: {
                modalComponentPath: path.join(
                  __dirname,
                  './src/components/GalleryPhotoModal/GalleryPhotoModal.tsx'
                )
            }
        }
    ],
};
