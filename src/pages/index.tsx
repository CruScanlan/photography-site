import React, { useCallback } from 'react';
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { animated } from 'react-spring';
import useBoop from 'hooks/useBoop';
import numberMap from 'utils/numberMap';
import useScrollPosition from '@react-hook/window-scroll';
import useWindowSize from 'hooks/useWindowSize';

import Layout from 'components/Layout';
import Button from 'components/Button';

const IndexPage = ({ homePageHero }) => {
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
        <Layout 
            pageTitle={'Cru Scanlan Photography'} 
            pageClass="top min-h-screen" 
            navbarScrollAnimation={{enabled: true}}
            pageDescription="Cru Scanlan is a landscape photographer based in South East Queensland, Australia. Specializing in capturing the beauty of the natural world, from the mountains to the sea. View his gallery and contact him for licensing, print purchases, or any questions about his photography work."
        >
            <div className="fixed h-[100vh] w-[100vw] overflow-hidden z-[-1]">
                <Image
                    src={homePageHero.img}
                    layout="fill"
                    quality={98}
                    loading="eager"
                    priority
                    placeholder="blur"
                    blurDataURL={homePageHero.base64}
                    alt="Cru Scanlan Photography"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute'
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
        </Layout>
    )
}

export const getStaticProps = async () => {
    const { base64, img } = await getPlaiceholder("/Eternal Growth 2022 - 2048px.jpg");

    return {
        props: {
            homePageHero: {
                base64,
                img
            }
        }
    }
}

export default IndexPage