import contentful from 'utils/contentful';
import { getPlaiceholder } from "plaiceholder";

import PrintClient from './print-client';

export async function generateStaticParams() {
    const landscapeImagesContentful = (await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage', 'fields.shop': true})).items;
    const landscapeSlugs = landscapeImagesContentful.map(item => item.fields.slug);

    return landscapeSlugs.map((slug) => ({
        printSlug: slug,
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ printSlug: string }> }) {
    const { printSlug } = await params;

    const landscapeImage = (await contentful.getEntries<any>({include: 2, content_type: 'landscapeImage', 'fields.slug': printSlug})).items[0].fields;
    landscapeImage.base64 = (await getPlaiceholder(`https:${landscapeImage.fullResImage.fields.file.url}`)).base64;

    const file = landscapeImage.fullResImage.fields.file;

    return (
        <PrintClient 
            landscapeImage={landscapeImage}
        />
    );
}

export async function generateMetadata({ params }: { params: Promise<{ printSlug: string }> }) {
    const { printSlug } = await params;
    const landscapeImage = (await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage', 'fields.slug': printSlug})).items[0]?.fields;
    
    return {
        title: `${landscapeImage?.title || 'Print'} Print For Sale | Cru Scanlan Photography`
    };
}

