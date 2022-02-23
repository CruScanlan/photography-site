import { GetStaticProps } from 'next';
import React, { ComponentProps } from 'react';
import Page, { getStaticProps as getStaticPropsQueryPage } from './[...queries]';


export const getStaticProps: GetStaticProps<ComponentProps<typeof Page>> = async (ctx) => {

    return { props: { collection: '' } }
};

export default Page;