import React from 'react';
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";

import HomeClient from './home-client';

export const metadata = {
  title: 'Cru Scanlan Photography',
  description: 'Cru Scanlan is a landscape photographer based in South East Queensland, Australia. Specializing in capturing the beauty of the natural world, from the mountains to the sea. View his gallery and contact him for licensing, print purchases, or any questions about his photography work.',
  openGraph: {
    title: 'Cru Scanlan Photography',
    description: 'Cru Scanlan is a landscape photographer based in South East Queensland, Australia.',
    url: 'https://cruscanlan.com',
    type: 'website',
    images: [{
      url: 'https://cruscanlan.com/Eternal Growth 2022 - 2048px.jpg?w=1080&q=95',
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cru Scanlan Photography',
    description: 'Cru Scanlan is a landscape photographer based in South East Queensland, Australia.',
    images: ['https://cruscanlan.com/Eternal Growth 2022 - 2048px.jpg?w=1080&q=95'],
  }
};

const IndexPage = async () => {
    const { base64, img } = await getPlaiceholder("/Eternal Growth 2022 - 2048px.jpg");

    return (
        <HomeClient homePageHero={{ base64, img }} />
    );
}

export default IndexPage;

