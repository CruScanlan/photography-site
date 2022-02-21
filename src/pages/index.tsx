import React, { useCallback } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { animated } from 'react-spring';
import useBoop from 'hooks/useBoop';
import numberMap from 'utils/numberMap';
import useScrollPosition from '@react-hook/window-scroll';
import useWindowSize from 'hooks/useWindowSize';

import Layout from 'components/Layout/Layout';
import Button from 'components/Button/Button';

const IndexPage = () => {
    const scrollPosition = useScrollPosition(60);
    const { width: windowWidth, height: windowHeight } = useWindowSize();

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
        <Layout pageTitle={'Cru Scanlan Photography'} pageClass="top min-h-screen" navbarScrollAnimation={{enabled: true}}>
            <div className="fixed h-[100vh] w-[100vw] overflow-hidden z-[-1]">
                <Image
                    src="/homePageHero2.jpg"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>
            <div style={{opacity}} className="flex flex-col items-center justify-center text-center z-10 h-[6000px]">
                {/* <h1 className="text-5xl text-lightPrimary max-w-screen-lg">LANDSCAPE PHOTOGRAPHY</h1>
                <h3 className="text-3xl text-lightPrimary max-w-screen-lg"><i>by Cru Scanlan</i></h3> */}
                <Button classes="mt-4" href="/gallery" type="transparent" size="lg" onMouseEnter={buttonHoverCallback} clickable={true}>
                    See Gallery
                    <animated.span style={heroButtonIconStyle}>
                        <FontAwesomeIcon className="ml-2 mt-1" icon={faArrowCircleRight} size="lg" />
                    </animated.span>
                </Button>
            </div>
            {/* <BackgroundImage critical={true} fluid={heroImage.childImageSharp.fluid} Tag="section" className="font-sans h-screen w-full bg-cover bg-fixed flex flex-col items-center justify-center">
                
            </BackgroundImage> */}
            {/* <section className="mb-8 flex flex-col justify-center items-center">
                <h2 className="mt-8 text-center">Latest Instagram Posts</h2>
                <div className="w-full flex flex-wrap justify-center items-center mt-8">
                    {
                        instaPosts.edges.map((edge: any, index: number) => {
                            const image = getImage(edge.node.localFile.childImageSharp.gatsbyImageData);
                            if(!image) return <div>Error: Could not get image</div>;
                            if(windowWidth && windowWidth < 1024 && index >= 4) return <></>; //Do not show more than 4 on less than lg screen  

                            return (
                                <div className="m-2 w-1/3 max-w-[16rem] max-h-30 flex-grow drop-shadow-lg">
                                    <a href={`https://instagram.com/p/${edge.node.id}`} target="_blank">
                                        <GatsbyImage image={image} alt="Image" />
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
                <a href="https://instagram.com/cruscanlan" target="_blank">
                    <Button size="lg" type="filled">View More <FontAwesomeIcon className="ml-2" icon={faInstagram} size="lg"/></Button>
                </a>
            </section> */}
        </Layout>
    )
}

export default IndexPage