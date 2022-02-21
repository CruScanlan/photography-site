import * as React from 'react';

import Layout from 'components/Layout/Layout';

const StorePage = () => {
  return (
    <Layout pageTitle={'Store | Cru Scanlan Photography'} pageClass="p-about bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
        <div className="max-w-4xl p-8">
            Store
        </div>
    </Layout>
  )
};

export default StorePage;