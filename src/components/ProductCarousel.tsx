import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from 'next/image';
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useComponentSize from '@rehooks/component-size';
import useWindowSize from 'hooks/useWindowSize';
import useClientSize from 'hooks/useClientSize';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
    slides: any;
    className?: string;
}

const ProductCarousel: React.FC<Props> = ({ slides, className = '' }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mainViewportRef, embla] = useEmblaCarousel({ 
        skipSnaps: false,
        align: 'center'
    }, [AutoHeight()]);

    const [thumbViewportRef, emblaThumbs] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
        axis: 'y'
    });

    const onThumbClick = useCallback((index) => {
        if (!embla || !emblaThumbs) return;
        if (emblaThumbs.clickAllowed()) embla.scrollTo(index);
    },[embla, emblaThumbs]);

    const onMouseOverThumb = useDebouncedCallback((index) => {
        if (!embla || !emblaThumbs) return;
        if (emblaThumbs.clickAllowed()) embla.scrollTo(index);
    }, 100)

    const onSelect = useCallback(() => {
        if (!embla || !emblaThumbs) return;
        setSelectedIndex(embla.selectedScrollSnap());
        emblaThumbs.scrollTo(embla.selectedScrollSnap());
    }, [embla, emblaThumbs, setSelectedIndex]);

    const onPrevClick = useCallback(() => {
        embla.scrollPrev();
    }, [embla]);

    const onNextClick = useCallback(() => {
        embla.scrollNext();
    }, [embla]);

    useEffect(() => {
        if (!embla) return;
        onSelect();
        embla.on("select", onSelect);
    }, [embla, onSelect]);

    const carouselContainerRef = useRef(null);
    const carouselThumbBarRef = useRef(null);
    const carouselContainerSize = useComponentSize(carouselContainerRef);
    const carouselThumbBarSize = useComponentSize(carouselThumbBarRef);
    const { height: windowHeight } = useWindowSize();
    const { width: clientWidth } = useClientSize();

    let calculatedSlideSizes: {width: number, height: number}[] = [];
    for(let i=0; i<slides.length; i++) {
        const slide = slides[i];

        let width = carouselContainerSize.width - (carouselThumbBarSize.width + 16); //Container minus thumbnail bar
        let height = width * (slide.height/slide.width);

        console.log(carouselContainerSize.width, clientWidth)
        if(carouselContainerSize.width > clientWidth) { //Exceeds screen 
            width = clientWidth - (carouselThumbBarSize.width + 16);
            height = width * (slide.height/slide.width);
        }
        
        const maxHeight = (0.7 * windowHeight);
        if(height > maxHeight) { //Height is bigger than 70% of the window
            height = maxHeight;
            width = height * (slide.width/slide.height);
        }

        calculatedSlideSizes.push({
            width,
            height
        });
    }
    const biggestWidth = Math.max(...calculatedSlideSizes.map(size => size.width));
    const biggestHeight = Math.max(...calculatedSlideSizes.map(size => size.height));

    return (
        <div className={`flex relative mb-4 ${className}`} style={{height: biggestHeight}}>
            <div className="absolute block min-w-full h-1" ref={carouselContainerRef} />
            <div className="relative h-full pr-2 py-2 lg:pr-5" ref={carouselThumbBarRef}>
                <div className="w-full flex justify-center">
                    <button className="opacity-60 touch-manipulation hover:opacity-90" onClick={onPrevClick}>
                        <FontAwesomeIcon className="rotate-90" icon={['fas', 'chevron-left']} size="2x" />
                    </button>
                </div>
                <div className="overflow-hidden h-auto" ref={thumbViewportRef}>
                    <div className="grid grid-flow-row gap-2 select-none touch-none cursor-default">
                        {slides.map((slide, index) => (
                            <div className={`rounded-md border-2 border-solid transition-[opacity] transition-[border] duration-200 ${index === selectedIndex ? "opacity-100 border-lightPrimary" : "opacity-50 border-transparent"}`} key={slide.id}>
                                <button
                                    onClick={() => onThumbClick(index)}
                                    onMouseOver={() => onMouseOverThumb(index)}
                                    className="w-14 lg:w-20 cursor-pointer relative block overflow-hidden touch-manipulation"
                                    type="button"
                                >
                                    <Image
                                        className="rounded-sm"
                                        src={slide.src}
                                        width={slide.width}
                                        height={slide.height}
                                        layout="responsive"
                                        quality={70}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full flex justify-center">
                    <button className="opacity-60 touch-manipulation hover:opacity-90" onClick={onNextClick}>
                        <FontAwesomeIcon className="rotate-90" icon={['fas', 'chevron-right']} size="2x" />
                    </button>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-full overflow-hidden" ref={mainViewportRef} style={{width: biggestWidth}}>
                    <div className="flex select-none touch-none transition-[height] ease-in-out duration-200">
                        {slides.map((slide, index) => (
                            <div 
                                className="flex-shrink-0 h-full transition-opacity ease-in-out duration-100" 
                                style={{
                                    opacity: selectedIndex === index ? '1' : '0', 
                                    flex: '0 0 auto', 
                                    width: calculatedSlideSizes[index].width, 
                                    height: calculatedSlideSizes[index].height
                                }} 
                                key={slide.id}
                            >
                                <Image
                                    className="w-full"
                                    src={slide.src}
                                    width={slide.width}
                                    height={slide.height}
                                    layout="responsive"
                                    objectFit="contain"
                                    placeholder="blur"
                                    blurDataURL={slide.base64}
                                    quality={95}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;