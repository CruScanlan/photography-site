import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import Layout from 'components/Layout';
import NavLink from 'components/NavLink';
import Button from 'components/Button';

//import getStripe from 'utils/get-stripejs';
//import { fetchPostJSON } from 'utils/api-helpers';
//import { formatAmountForDisplay } from 'utils/stripe-helpers';

const Store = (props) => {
    const [storeSectionsOpen, setStoreSectionsOpen] = useState(false);

    const onStoreSectionsClick = () => {
        setStoreSectionsOpen(!storeSectionsOpen);
    }

    const handleCloseStoreSections = () => {
        setStoreSectionsOpen(false);
    }

    return (
        <Layout 
            pageTitle={'Store | Cru Scanlan Photography'} 
            pageClass="bg-darkSecondary" 
            navbarScrollAnimation={{
                enabled: true,
                startPositonRelative: 0.15,
                startPositionAbsolute: 20,
                endPositionRelative: 0.3,
                endPositionAbsolute: 90
            }}
        >
            <div className="w-full h-[45vh]">
                <Image 
                    className="w-full h-[45vh] !fixed z-[0] overflow-hidden"
                    alt="Image" 
                    loading="eager"
                    quality={98}
                    layout="responsive"
                    objectFit="cover"
                    priority
                    placeholder='blur'
                    blurDataURL={props.banner.base64}
                    src={props.banner.img}
                />
            </div>
            <div className="relative text-lightPrimary flex bg-darkSecondary">
                <div className="hidden md:block p-4 pl-2 pt-8 min-w-[14rem] lg:pl-8 lg:min-w-[16rem] border-r-[1px] border-solid border-lightTertiary">
                    <ShopSections storeDetails={props.storeDetails} photoCollectionOrder={props.photoCollectionOrder} locations={props.locations} />
                </div>
                <div className="flex-grow flex justify-center">
                    <div className="max-w-7xl p-8 pt-2 3xl:max-w-[95rem]">
                        <div className="flex flex-col justify-center pt-4 w-full md:hidden">
                            <Button fullWidth clickable size="lg" type="filled" onClick={onStoreSectionsClick}>
                                <h3>Store Sections</h3>
                                <FontAwesomeIcon className={`ml-8 transition-transform ease-in-out duration-100 ${!storeSectionsOpen ? 'rotate-180' : ''}`} icon={['fas', 'chevron-down']} />
                            </Button>
                            <div onClick={handleCloseStoreSections} className={`pt-2 border-solid border-lightSecondary shadow-lg overflow-hidden transition-[max-height] ease-in-out duration-400 ${!storeSectionsOpen ? 'max-h-0 border-0' : 'border-2 border-t-0 max-h-[1000px]'}`}>
                                <div className="px-4">
                                    <ShopSections storeDetails={props.storeDetails} photoCollectionOrder={props.photoCollectionOrder} locations={props.locations} />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-center p-8">
                            {props.storeDetails.name}
                        </h2>
                        <div className="flex justify-center mb-10">
                            <div className="max-w-xl">
                                {documentToReactComponents(props.storeDetails.description)}
                            </div>
                        </div>
                        <div className="flex flex-row-wrap justify-between mb-4 text-sm">
                            <div>
                                <span className="text-lightSecondary">
                                    <Link href="/store">
                                        <a className="hover:underline">Store</a>
                                    </Link>
                                    {
                                        props.storeDetails.type !== 'root' && (
                                            <span> / {props.storeDetails.type === 'location' ? 'Location' : 'Collection'} / </span>
                                        )
                                    }
                                    {
                                        props.storeDetails.type === 'root' && (
                                            <span> / </span>
                                        )
                                    }
                                </span>
                                <span>
                                    {props.storeDetails.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-lightSecondary">Showing {props.landscapeImages.length} results</span>
                            </div>
                        </div>
                        <div className="grid gap-8 auto-rows-min grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
                            {
                                props.landscapeImages.map(landscapeImage => (
                                    <div key={landscapeImage.slug}>
                                        <Link href={`/store/print/${landscapeImage.slug}`}>
                                            <a>
                                                <div className="w-full hover:cursor-pointer">
                                                    <Image
                                                        src={landscapeImage.productImage.publicFile}
                                                        width={landscapeImage.productImage.width}
                                                        height={landscapeImage.productImage.height}
                                                        quality={90}
                                                    />
                                                </div>
                                                <h4 className="text-center hover:cursor-pointer">{landscapeImage.title}</h4>
                                                <p className="text-center text-lightSecondary text-sm">From ${landscapeImage.products[0].price} AUD</p>
                                            </a>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
};

const ShopSections = (props) => {
    return (
        <>
            <div className="block py-2 pl-2 mb-2 text-lightSecondary no-underline font-semibold hover:underline hover:text-lightPrimary">
                <NavLink href={`/store`} activeClassName="underline text-lightPrimary" exact>
                    <a>All Prints</a>
                </NavLink>
            </div>
            <h4 className="uppercase font-semibold">Shop Collections</h4>
            <div className="w-full mt-1 border-solid border-t-[1px] border-lightSecondary" />
            <div>
                {
                    props.photoCollectionOrder.map(photoCollection => (
                        <div className="block py-2 pl-2 text-lightSecondary no-underline font-medium hover:underline hover:text-lightPrimary" key={photoCollection.slug}>
                            <NavLink href={`/store/collection/${photoCollection.slug}`} activeClassName="underline text-lightPrimary">
                                <a>{photoCollection.name}</a>
                            </NavLink>
                        </div>
                    ))
                }
            </div>
            <h4 className="mt-6 uppercase font-semibold">Shop Locations</h4>
            <div className="w-full mb-2 border-solid border-t-[1px] border-lightSecondary" />
            <div>
                {
                    props.locations.map(location => (
                        <div className="block py-2 pl-2 text-lightSecondary no-underline font-medium hover:underline hover:text-lightPrimary" key={location.slug}>
                            <NavLink href={`/store/location/${location.slug}`} activeClassName="underline text-lightPrimary">
                                <a>{location.name}</a>
                            </NavLink>
                        </div>
                    ))
                }
            </div>
        </>
    )
};

export default Store;