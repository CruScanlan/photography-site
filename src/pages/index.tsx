import React, { useCallback } from 'react';
import { graphql, useStaticQuery, Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import BackgroundImage from "gatsby-background-image-es5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { animated } from 'react-spring';
import useBoop from 'hooks/useBoop';
import numberMap from 'utils/numberMap';
import useScrollPosition from '@react-hook/window-scroll';
import useWindowSize from 'hooks/useWindowSize';

import Layout from 'components/Layout/Layout';
import Button from 'components/Button/Button';

const IndexPage = () => {
    const { heroImage, instaPosts } = useStaticQuery(
        graphql`
            query {
                heroImage: file(relativePath: { eq: "homePageHero2.jpg" }) {
                    childImageSharp {
                        fluid(quality: 100, maxWidth: 2000) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
                instaPosts: allInstaNode(limit: 4) {
                    edges {
                        node {
                            localFile {
                                childImageSharp {
                                    gatsbyImageData (
                                        quality: 100
                                        placeholder: BLURRED
                                        formats: [AUTO, WEBP]
                                        height: 500
                                    )
                                }
                            }
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
                    <h1 className="text-5xl text-lightPrimary max-w-screen-lg">LANDSCAPE PHOTOGRAPHY</h1>
                    <h3 className="text-3xl text-lightPrimary max-w-screen-lg"><i>by Cru Scanlan</i></h3>
                    <Button classes="mt-4" to="/gallery" type="transparent" size="lg" onMouseEnter={buttonHoverCallback}>
                        See Gallery
                        <animated.span style={heroButtonIconStyle}>
                            <FontAwesomeIcon className="ml-2 mt-1" icon={faArrowCircleRight} size="lg" />
                        </animated.span>
                    </Button>
                </div>
            </BackgroundImage>
            <section className="mb-8 flex flex-col justify-center items-center">
                <h1 className="mt-8 uppercase text-center">Instagram</h1>
                <div className="flex flex-wrap justify-center items-center mt-8">
                    {
                        instaPosts.edges.map((edge: any) => {
                            const image = getImage(edge.node.localFile.childImageSharp.gatsbyImageData);
                            if(!image) return <div>Error: Could not get image</div>;

                            return (
                                <div className="m-2 max-w-xs">
                                    <GatsbyImage image={image} alt="Image" />
                                </div>
                            )
                        })
                    }
                </div>
                <a href="https://instagram.com/cruscanlan" target="_blank">
                    <Button size="lg" type="filled">View More</Button>
                </a>
            </section>
        </Layout>
    )
};

export default IndexPage;