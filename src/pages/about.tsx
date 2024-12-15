import React from 'react';
import Image from 'next/image';

import Layout from 'components/Layout';
import Button from 'components/Button';
import TextLink from 'components/TextLink';

const AboutPage = () => {
  return (
    <Layout pageTitle={'About | Cru Scanlan Photography'} pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
        <div className="flex flex-col w-full">
            <h1 className="text-4xl text-center font-bold my-8">
                About
            </h1>
            <div className="max-w-6xl p-8 flex flex-col lg:flex-row gap-12 mx-auto">
                <div className="lg:max-w-[60%]">
                    <div className="space-y-6 text-lg">
                        <p>
                            Hi, I'm Cru – a landscape and nature photographer based in South East Queensland, Australia.
                        </p>

                        <p>
                            My journey with photography began in 2019 when I bought my first DSLR, a Canon 80D. Drawn by my love of technology and the beautiful images I'd always admired, I felt compelled to pick up a "real" camera and see what I could create. In the beginning, I photographed anything and everything that caught my eye – mostly birds, with no particular focus.
                        </p>

                        <p>
                            Things changed in 2020 when I moved to Rainbow Beach, Queensland, at the start of the COVID-19 pandemic. One day, I wandered down to the harbor with my camera and captured a sunset over the water. That image, and the process of editing it in Adobe Lightroom, sparked a deep passion for landscape photography. It became the perfect creative outlet and a way to reconnect with the outdoors during a challenging time.
                        </p>

                        <p>
                            Since then, my love for photography has only grown. It's taken me to some of the most stunning and remote places I've ever seen. When I'm not working as a software engineer, I'm out exploring new terrain, chasing light, and capturing the beauty of the natural world.
                        </p>

                        <p>
                            Photography has given me a profound appreciation for the diversity of landscapes and the allure of untouched wilderness. Through my images, I strive to share this connection with nature and inspire others to experience it for themselves.
                        </p>

                        <p>
                            Whether you're interested in purchasing a print, collaborating on a project, or just saying hello, feel free to reach out through my{' '}
                            <TextLink href="/contact">
                                contact form
                            </TextLink>{' '}
                            or send me a message on{' '}
                            <TextLink href="https://instagram.com/cruscanlan" external>
                                Instagram
                            </TextLink>{' '}
                            – I'd love to hear from you!
                        </p>
                    </div>
                </div>

                <div className="lg:flex lg:top-24 flex-col items-center gap-4">
                    <div className="w-full max-w-[400px] bg-gray-800">
                        <Image
                            src="pages/about/cru.jpg"
                            alt="Cru Scanlan"
                            quality={90}
                            width={400}
                            height={400}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Button href="/contact" type="filled" size="sm" clickable>
                        Contact Me
                    </Button>
                </div>
            </div>
            <div className="w-full my-12 px-4 relative max-w-screen-md mx-auto">
                <Image
                    src="/pages/about/cru-aurora.jpg"
                    alt="Banner"
                    width={1632}
                    height={1305}
                    quality={90}
                    className="w-full h-full object-cover"
                />
            </div>
            
        </div>
    </Layout>
  )
};

export default AboutPage;