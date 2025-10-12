'use client';

import React from 'react';
import Link from 'next/link';
import Image from "next/image";

type IRenderGalleryImageProps = {
    photo: {
        src: string;
        width: number;
        height: number;
        imageSlug: string;
        collectionSlug: string;
        base64: string;
    };
    imageProps: {
        src: string;
        alt: string;
        title?: string;
        style: React.CSSProperties;
    } & React.HTMLAttributes<HTMLImageElement>;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
};

const GalleryImage: React.FC<IRenderGalleryImageProps> = ({ photo, imageProps, wrapperProps }) => {
    const { width, height, imageSlug, collectionSlug, base64 } = photo;
    const { src, alt, title, style } = imageProps;
    const { style: wrapperStyle, ...restWrapperProps } = wrapperProps ?? {};

    return (
        <div 
            className="relative hover:cursor-pointer" 
            style={{
                ...wrapperStyle,
                position: 'relative',
                width: style.width,
                padding: style.padding,
                marginBottom: style.marginBottom
            }}
            {...restWrapperProps}
        >
            <Link href={`/image/${imageSlug}?collection=${collectionSlug}`} className="w-full h-full z-10 absolute flex flex-row items-end opacity-0 transition-opacity duration-600 hover:opacity-100">
                <div className="p-2 w-full bg-opacity-80 bg-darkSecondary">
                    <h4 className="text-lightPrimary">{ title }</h4>
                </div>
            </Link>
            <Image 
                quality={92}
                src={src} 
                width={width} 
                height={height} 
                sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                alt={alt}
                placeholder="blur"
                blurDataURL={base64}
                style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
        </div>
    );
}

export default GalleryImage;

