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
        src: string | Blob;
        alt: string;
        title?: string;
        style: React.CSSProperties;
        sizes?: string;
    } & React.HTMLAttributes<HTMLImageElement>;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
};

const GalleryImage = ({ photo, imageProps, wrapperProps }: IRenderGalleryImageProps): React.ReactElement => {
    const { width, height, imageSlug, collectionSlug, base64 } = photo;
    const { src, alt, title, style, sizes } = imageProps;
    const { style: wrapperStyle, ...restWrapperProps } = wrapperProps ?? {};

    // Ensure src is a string for Next.js Image component
    const imageSrc = typeof src === 'string' ? src : photo.src;

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
                quality={90}
                src={imageSrc}
                width={width} 
                height={height} 
                sizes={sizes ?? '100vw'}
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

