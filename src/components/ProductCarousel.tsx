import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from 'next/image';
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useComponentSize from '@rehooks/component-size';
import { useDebouncedCallback } from 'use-debounce';

const ProductCarousel = ({ slides }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mainViewportRef, embla] = useEmblaCarousel({ 
        skipSnaps: false
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
    }, 150)

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

    const carousalContainerRef = useRef(null);
    const carousalContainerSize = useComponentSize(carousalContainerRef);
    const realSlideWidth = carousalContainerSize.width - 250;

    return (
        <div className="flex">
            <div className="absolute min-w-full" ref={carousalContainerRef} />
            <div className="relative p-5 pt-2 h-full">
                <button className="absolute justify-center top-3 left-[40%] opacity-60 touch-manipulation" onClick={onPrevClick}>
                    <FontAwesomeIcon className="rotate-90" icon={['fas', 'chevron-left']} size="2x" />
                </button>
                <button className="absolute justify-center -bottom-4 left-[40%] opacity-60 touch-manipulation" onClick={onNextClick}>
                    <FontAwesomeIcon className="rotate-90" icon={['fas', 'chevron-right']} size="2x" />
                </button>
                <div className="overflow-hidden mt-10 h-auto" ref={thumbViewportRef}>
                    <div className="grid grid-flow-row gap-2 select-none touch-none cursor-default">
                        {slides.map((slide, index) => (
                            <div className={`rounded-md border-2 border-solid transition-[opacity] transition-[border] duration-200 ${index === selectedIndex ? "opacity-100 border-lightPrimary" : "opacity-50 border-transparent"}`} key={slide.id}>
                                <button
                                    onClick={() => onThumbClick(index)}
                                    onMouseOver={() => onMouseOverThumb(index)}
                                    className="w-20 cursor-pointer relative block overflow-hidden touch-manipulation"
                                    type="button"
                                >
                                    <Image
                                        src={slide.src}
                                        width={slide.width}
                                        height={slide.height}
                                        layout="responsive"
                                    />
                                </button>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="relative p-2 mx-auto w-full">
                <div className="overflow-hidden" ref={mainViewportRef}>
                    <div className="grid grid-flow-col gap-2 select-none touch-none transition-[height] ease-in-out duration-200" style={{width: realSlideWidth}}>
                        {slides.map((slide) => (
                            <div style={{width: realSlideWidth, height: realSlideWidth * (slide.height/slide.width)}} key={slide.id}>
                                <div className="overflow-hidden">
                                    <Image
                                        src={slide.src}
                                        width={slide.width}
                                        height={slide.height}
                                        layout="responsive"
                                        placeholder="blur"
                                        blurDataURL={slide.base64}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;