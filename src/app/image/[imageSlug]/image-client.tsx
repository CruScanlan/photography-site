'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useComponentSize from '@rehooks/component-size';
import useWindowSize from 'hooks/useWindowSize';

import ClientLayout from 'components/ClientLayout';

type IImageDimensions = {width: number; height: number};

interface Props {
    image: any;
    collectionSlug: string;
    nextImageSlug: string;
    previousImageSlug: string;
    nextImage: any;
    previousImage: any;
}

const ImageClient: React.FC<Props> = ({ image, collectionSlug, nextImageSlug, previousImageSlug, nextImage, previousImage }) => {

    const imageDimensionsPrimary: IImageDimensions = image.fullResImage.fields.file.details.image;
    const imageDimensionsNext: IImageDimensions = nextImage.fullResImage.fields.file.details.image;
    const imageDimensionsPrevious: IImageDimensions = previousImage.fullResImage.fields.file.details.image;

    const { width: windowWidth, height: windowHeight } = useWindowSize();
    const imageInfoSizeRef = useRef(null);
    const imageInfoSize = useComponentSize(imageInfoSizeRef);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const isNavigatingRef = useRef(false);
    
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Restore fullscreen when navigating between images if it was active
    useEffect(() => {
        const wasFullscreen = sessionStorage.getItem('imageFullscreen') === 'true';
        
        if (wasFullscreen && !document.fullscreenElement) {
            if (!containerRef.current) {
                // Don't reset navigation flag yet - wait for ref to be ready
                return;
            }
            
            // Small delay to ensure the new image container is ready
            setTimeout(() => {
                containerRef.current?.requestFullscreen().catch(err => {
                    console.error('Error entering fullscreen on navigation:', err);
                    sessionStorage.removeItem('imageFullscreen');
                }).finally(() => {
                    isNavigatingRef.current = false;
                });
            }, 50);
        } else {
            // Not in navigation mode or already in fullscreen
            isNavigatingRef.current = false;
        }
    }, [image.slug, containerRef.current]);

    // Handle fullscreen state changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isNowFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isNowFullscreen);
            
            // Store fullscreen state for persistence across navigation
            // Don't clear the flag if we're navigating (it will be restored on the next page)
            if (isNowFullscreen) {
                sessionStorage.setItem('imageFullscreen', 'true');
            } else if (!isNavigatingRef.current) {
                sessionStorage.removeItem('imageFullscreen');
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        try {
            if (!isFullscreen) {
                await containerRef.current?.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Error toggling fullscreen:', error);
        }
    };

    // Navigation handlers
    const navigateToNext = () => {
        isNavigatingRef.current = true;
        router.push(`/image/${nextImageSlug}?collection=${collectionSlug}`);
    };

    const navigateToPrevious = () => {
        isNavigatingRef.current = true;
        router.push(`/image/${previousImageSlug}?collection=${collectionSlug}`);
    };

    const closeAndReturnToGallery = async () => {
        // Clear fullscreen state
        sessionStorage.removeItem('imageFullscreen');
        
        // Exit fullscreen if active
        if (document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch (error) {
                console.error('Error exiting fullscreen:', error);
            }
        }
        
        // Navigate back to gallery
        router.push(`/gallery/${collectionSlug}`);
    };

    // Prefetch adjacent routes for instant navigation
    useEffect(() => {
        router.prefetch(`/image/${nextImageSlug}?collection=${collectionSlug}`);
        router.prefetch(`/image/${previousImageSlug}?collection=${collectionSlug}`);
    }, [nextImageSlug, previousImageSlug, collectionSlug, router]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                navigateToNext();
            } else if (e.key === 'ArrowLeft') {
                navigateToPrevious();
            } else if (e.key === 'Escape' && !isFullscreen) {
                closeAndReturnToGallery();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [nextImageSlug, previousImageSlug, collectionSlug, isFullscreen, router, navigateToNext, navigateToPrevious, closeAndReturnToGallery]);

    if(!windowWidth || !windowHeight) return <div>Loading...</div>

    const getImageSize = (imageDimensions: IImageDimensions, wScalingFactor: number, hScalingFactor: number): IImageDimensions => {
        const wRatio = (windowWidth / imageDimensions.width) * wScalingFactor;
        const hRatio =  ((windowHeight - imageInfoSize.height) / imageDimensions.height) * hScalingFactor;
        const ratio  = Math.min(hRatio, wRatio);

        const width = imageDimensions.width * ratio;
        const height = imageDimensions.height * ratio;

        return {width, height}
    }
    let wScalingFactor = 0.87;
    let hScalingFactor = 0.92;

    if(windowWidth > 1024) wScalingFactor = 0.92; //Breakpoint

    const { width, height } = getImageSize(imageDimensionsPrimary, wScalingFactor, hScalingFactor);
    const { width: widthNext, height: heightNext } = getImageSize(imageDimensionsNext, wScalingFactor, hScalingFactor);
    const { width: widthPrevious, height: heightPrevious } = getImageSize(imageDimensionsPrevious, wScalingFactor, hScalingFactor);

    const imageFile = image.fullResImage.fields.file;
    const nextImageFile = nextImage.fullResImage.fields.file;
    const previousImageFile = previousImage.fullResImage.fields.file;

    const location = image.location ? image.location.fields.name : 'Unknown Location';

    return (
        (<ClientLayout
            pageTitle={`${image.title} | Cru Scanlan Photography`} 
            pageClass="bg-darkPrimary relative"
            fullPage={true}
            ogImage={image.fullResImage.fields.file.url}
            ogUrl={`https://cruscanlan.com/image/${image.slug}`}
        >
            <div ref={containerRef} className="w-screen h-screen bg-darkPrimary">
                <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center z-10">
                    <button 
                        onClick={navigateToPrevious}
                        className="hover:cursor-pointer focus:outline-none"
                        aria-label="Previous image"
                    >
                        <FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary transition-colors" icon={['fas', 'chevron-left']} size="2x" />
                    </button>
                </div>
                <div className="absolute h-screen p-1 md:p-4 2xl:p-8 flex items-center right-0 z-10">
                    <button 
                        onClick={navigateToNext}
                        className="hover:cursor-pointer focus:outline-none"
                        aria-label="Next image"
                    >
                        <FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary transition-colors" icon={['fas', 'chevron-right']} size="2x" />
                    </button>
                </div>
                <div className="absolute w-screen p-1 md:p-4 2xl:p-8 flex justify-end gap-4 z-10">
                    <button 
                        onClick={toggleFullscreen}
                        className="hover:cursor-pointer focus:outline-none"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                        <FontAwesomeIcon 
                            className="text-lightSecondary hover:text-lightPrimary transition-colors" 
                            icon={['fas', isFullscreen ? 'compress' : 'expand']} 
                            size="xl" 
                        />
                    </button>
                    <button 
                        onClick={closeAndReturnToGallery}
                        className="hover:cursor-pointer focus:outline-none"
                        aria-label="Close and return to gallery"
                    >
                        <FontAwesomeIcon className="text-lightSecondary hover:text-lightPrimary transition-colors" icon={['fas', 'times']} size="2x" />
                    </button>
                </div>
                <div className="w-screen h-screen flex flex-col justify-center items-center">
                <div style={{width, height}} className="block">
                    {
                        image && <Image
                            priority 
                            loading="eager"
                            quality={95}
                            src={`https:${imageFile.url}`} 
                            width={imageFile.details.image.width} 
                            height={imageFile.details.image.height} 
                            sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                            alt={`${image.title} | ${location} | Cru Scanlan Photography`}
                            //placeholder="blur"
                            //blurDataURL={imageFile.base64}
                            style={{
                                objectFit: 'contain'
                            }}
                        />
                    }
                    {
                        !image && <div className="text-lightPrimary">Could not find Image</div>
                    }
                </div>
                <div style={{width: widthNext, height: heightNext}} className="block absolute opacity-0 -z-10">
                    {
                        nextImage && <Image
                            loading="lazy"
                            quality={95}
                            src={`https:${nextImageFile.url}`} 
                            width={nextImageFile.details.image.width} 
                            height={nextImageFile.details.image.height}
                            sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    }
                </div>
                <div style={{width: widthPrevious, height: heightPrevious}} className="block absolute opacity-0 -z-10">
                    {
                        previousImage && <Image
                            loading="lazy"
                            quality={95}
                            src={`https:${previousImageFile.url}`} 
                            width={previousImageFile.details.image.width} 
                            height={previousImageFile.details.image.height}
                            sizes="(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 750px) 750px, (max-width: 828px) 828px, (max-width: 1080px) 1080px, (max-width: 1200px) 1200px, (max-width: 1920px) 1920px, (max-width: 2048px) 2048px, 3840px"
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    }
                </div>
                <div style={{width}} className="mt-2 flex flex-col justify-between items-center md:flex-row" ref={imageInfoSizeRef}>
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lightPrimary">{image.title}</h3>
                        <span className="text-sm text-lightSecondary">{location}</span>
                    </div>
                    {/* <Button size="md" classes="mt-2 md:m-0 md:ml-2" href={`/store/print/${imageSlug}`} clickable>BUY PRINT</Button> */}
                </div>
                </div>
            </div>
        </ClientLayout>)
    );
};

export default ImageClient;

