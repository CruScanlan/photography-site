import React, { useCallback } from 'react';
import { graphql, useStaticQuery, Link } from "gatsby";
import BackgroundImage from "gatsby-background-image-es5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { animated } from 'react-spring';
import useBoop from 'hooks/useBoop';
import numberMap from 'utils/numberMap';
import useScrollPosition from '@react-hook/window-scroll';
import useWindowSize from 'hooks/useWindowSize';

import './index.css';

import Layout from 'components/Layout/Layout';
import Button from 'components/Button/Button';

const IndexPage = () => {
    const { heroImage } = useStaticQuery(
        graphql`
            query {
                heroImage: file(relativePath: { eq: "homePageHero2.jpg" }) {
                    childImageSharp {
                        fluid(quality: 100, maxWidth: 2000) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
        `
    );

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
        <Layout pageTitle={'Cru Scanlan Photography'} pageClass="p-home top" navbarScrollAnimation={{enabled: true}}>
            <BackgroundImage critical={true} fluid={heroImage.childImageSharp.fluid} Tag="section" className="font-sans h-screen w-full bg-cover bg-fixed flex flex-col items-center justify-center">
                <div style={{opacity}} className="flex flex-col items-center justify-center text-center">
                    <h1 className="text-5xl text-white max-w-screen-lg">LANDSCAPE PHOTOGRAPHY</h1>
                    <h3 className="text-3xl text-white max-w-screen-lg"><i>by Cru Scanlan</i></h3>
                    <div className="mt-4 rounded-md shadow" onMouseEnter={buttonHoverCallback}>
                        <Link
                            to="/favourite-images"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold text-white bg-orange-500 hover:bg-orange-700 md:py-4 md:px-10"
                        >
                            See Gallery
                            <animated.span style={heroButtonIconStyle}>
                                <FontAwesomeIcon className="ml-2 mt-1" icon={faArrowCircleRight} size="lg" />
                            </animated.span>
                        </Link>
                    </div>
                </div>
            </BackgroundImage>
            <div style={{height: 900}} className="bg-gray-100">

            </div>
        </Layout>
    )
};

export default IndexPage;