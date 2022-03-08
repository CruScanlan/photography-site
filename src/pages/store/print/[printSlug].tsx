import React from 'react';
import contentful from 'utils/contentful';

import Layout from 'components/Layout';

const ProductPage = () => {
  return (
    <Layout pageTitle={'Product | Cru Scanlan Photography'} pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
        <div className="max-w-4xl p-8">
            <h1 className="text-center p-8">
                Product
            </h1>
        </div>
    </Layout>
  )
};

export default ProductPage;

export const getStaticProps = () => {

    return {
        props: {

        }
    }
}

export const getStaticPaths = async () => {
    const landscapeImagesContentful = (await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage', 'fields.shop': true})).items

    const landscapeSlugs = landscapeImagesContentful.map(item => item.fields.slug);

    return {
        paths: landscapeSlugs.map(landscapeSlug => ({ params: { printSlug: landscapeSlug }})),
        fallback: false // false or 'blocking'
    };
}