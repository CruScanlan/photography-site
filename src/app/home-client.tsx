'use client';

import React, { useCallback } from 'react';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { animated } from 'react-spring';
import useBoop from 'hooks/useBoop';
import numberMap from 'utils/numberMap';
import useScrollPosition from '@react-hook/window-scroll';
import useWindowSize from 'hooks/useWindowSize';

import ClientLayout from 'components/ClientLayout';
import Button from 'components/Button';

interface Props {
    homePageHero: {
        base64: string;
        img: any;
    };
}

const HomeClient: React.FC<Props> = ({ homePageHero }) => {
    const scrollPosition = useScrollPosition(60);
    const { height: windowHeight } = useWindowSize();

    const [heroButtonIconStyle, heroButtonTrigger] = useBoop({
        x: 5,
        timing: 150,
        springConfig: {
            tension: 300,
            friction: 20
        }
    });

    const buttonHoverCallback = useCallback(() => setTimeout(heroButtonTrigger, 200), [heroButtonTrigger]);

    let opacity: number;
    
    if(windowHeight) {
        const [startHeight, endHeight] = [windowHeight*0.2, windowHeight*0.4]
        opacity = scrollPosition < startHeight ? 1 : scrollPosition <  endHeight ? 1-numberMap(scrollPosition, startHeight, endHeight, 0, 1) : 0;
    } else opacity = scrollPosition < 150 ? 1 : scrollPosition < 300 ? 1-numberMap(scrollPosition, 150, 300, 0, 1) : 0;

    return (
        <ClientLayout 
            pageTitle={'Cru Scanlan Photography'} 
            pageClass="top min-h-screen" 
            navbarScrollAnimation={{enabled: true}}
            pageDescription="Cru Scanlan is a landscape photographer based in South East Queensland, Australia. Specializing in capturing the beauty of the natural world, from the mountains to the sea. View his gallery and contact him for licensing, print purchases, or any questions about his photography work."
            ogImage={'/Eternal Growth 2022 - 2048px.jpg'}
            ogUrl={'https://cruscanlan.com'}
        >
            <div className="fixed h-[100vh] w-[100vw] overflow-hidden z-[-1]">
                <Image
                    src={homePageHero.img.src}
                    fill
                    quality={95}
                    loading="eager"
                    priority
                    placeholder="blur"
                    blurDataURL={homePageHero.base64}
                    alt="Cru Scanlan Photography"
                    style={{
                        objectFit: 'cover'
                    }}
                />
            </div>
            <div style={{opacity}} className="flex flex-col items-center justify-center text-center z-10 h-screen">
                <Button classes="mt-4" href="/gallery" type="transparent" size="lg" onMouseEnter={buttonHoverCallback} clickable={true}>
                    See Gallery
                    <animated.span style={heroButtonIconStyle}>
                        <FontAwesomeIcon className="ml-2 mt-1" icon={['fas', 'arrow-circle-right']} size="lg" />
                    </animated.span>
                </Button>
            </div>
        </ClientLayout>
    );
}

export default HomeClient;

