import React, { useCallback, useState } from 'react';
import contentful from 'utils/contentful';
import Image from 'next/image';
import { getPlaiceholder } from "plaiceholder";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useShoppingCart } from 'use-shopping-cart';

import { useAppDispatch } from 'hooks/storeHooks';
import { setIsOpen } from 'store/cartReducer';

import createProductImage from 'utils/productImages/create';

import ProductCarousel from 'components/ProductCarousel';
import Layout from 'components/Layout';
import Button from 'components/Button';
import FormDropdown from 'components/FormDropdown';

const ProductPage = (props) => {
    const landscapeImageFile = props.landscapeImage.fullResImage.fields.file;

    const slides = [
        {
            id: 1,
            src: props.productImage.publicFile,
            width: props.productImage.width,
            height: props.productImage.height,
            base64: props.productImage.base64
        },
        {
            id: 2,
            src: `https:${landscapeImageFile.url}`,
            width: landscapeImageFile.details.image.width,
            height: landscapeImageFile.details.image.height,
            base64: props.landscapeImage.base64
        }        
    ];

    const products = props.landscapeImage.shopProducts.map(product => product.fields);

    //Get product drop down data and calc selected product
    const getProductInfo = (type?: string, size?: string) => {
        //Get material types
        const types = products.map(product => product.type);
        //@ts-ignore
        const allProductTypes = [...new Set(types)]; //Unique types
        const productType = type || allProductTypes[0];
        
        //Get sizes that belong to selected material type
        const sizes = products.filter(product => product.type === productType).map(product => product.size);
        //@ts-ignore
        const allProductSizes = [...new Set(sizes)];
        const productSize = size || allProductSizes[0];
        
        //Get selected product
        const product = products.filter(product => product.type === productType && product.size === productSize)[0];

        return {
            allProductTypes,
            productType,
            allProductSizes,
            productSize,
            product
        }
    }

    const { 
        allProductTypes,
        productType,
        allProductSizes, 
        productSize,
        product 
    } = getProductInfo();

    //Set dropdown options
    const [type, setType] = useState(productType);  
    const [sizes, setSizes] = useState(allProductSizes);
    const [size, setSize] = useState(productSize);
    const [selectedProduct, setSelectedProduct] = useState(product);

    /*
        <div className="mt-8">
            {documentToReactComponents(props.landscapeImage.description)}
        </div>
    */

    const onTypeChanged = (item: string) => { //Material type changed
        const { 
            allProductSizes: newProductSizes, 
            productSize: newProductSize, 
            product: newProduct
        } = getProductInfo(item);

        setType(item);
        setSizes(newProductSizes);
        setSize(newProductSize);
        setSelectedProduct(newProduct);
    }

    const onSizeChanged = (item: string) => { //Size changed
        const { 
            product: newProduct
        } = getProductInfo(type, item);

        setSize(item);
        setSelectedProduct(newProduct);
    }

    const {
        addItem
    } = useShoppingCart();
    const dispatch = useAppDispatch();

    const onAddToCart = () => {
        addItem({
            id: `${props.landscapeImage.id}/${selectedProduct.id}`,
            name: props.landscapeImage.title,
            price: selectedProduct.price,
            currency: 'AUD'
        });
        dispatch(setIsOpen(true));
    };

    return (
        <Layout pageTitle={'Product | Cru Scanlan Photography'} pageClass="bg-darkSecondary text-lightPrimary flex justify-center" padTop={true}>
            <div className="max-w-[1536px] w-full md:p-8">
                <div className="grid mt-4 lg:mt-0 lg:grid-cols-[1fr_auto]">
                    <div className="max-w-5xl min-w-0">
                        <ProductCarousel slides={slides} />
                    </div>
                    <div className="w-fill lg:w-[28rem] p-4 mt-6 ml-4">
                        <h2 className="w-full">
                            {props.landscapeImage.title}
                        </h2>
                        <h3 className="mt-4 text-3xl text-lightSecondary text">${selectedProduct.price}</h3>

                        <FormDropdown 
                            classes="mt-4 md:w-4/5" 
                            items={allProductTypes} 
                            onChanged={onTypeChanged}
                            value={type}
                        />

                        <FormDropdown 
                            classes="mt-4 md:w-4/5" 
                            items={sizes} 
                            onChanged={onSizeChanged}
                            value={size}
                        />

                        <Button classes="mt-8 w-full md:w-4/5" size="lg" type="filled" clickable onClick={onAddToCart}>
                            Add to Cart <FontAwesomeIcon className="ml-2" icon={['fas', 'cart-arrow-down']} />
                        </Button>

                        <div className="mt-4">
                            <div className="p-1">
                                <FontAwesomeIcon className="mr-3 w-4" icon={['fas', 'paint-brush']} />Premium Fine Art Materials & Coatings
                            </div>
                            <div className="p-1">
                                <FontAwesomeIcon className="mr-3 w-4" icon={['fas', 'circle-check']} />Made-To-Order
                            </div>
                            <div className="p-1">
                                <FontAwesomeIcon className="mr-3 w-4" icon={['fas', 'truck-fast']} />Fast Delivery With Tracking & Insurance
                            </div>
                            <div className="p-1">
                                <FontAwesomeIcon className="mr-3 w-4" icon={['fas', 'shield']} />Secure Payments
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-lightTertiary w-full h-[600px]" />
            </div>
        </Layout>
    )
};

export default ProductPage;

export const getStaticProps = async ({ params }) => {
    const printSlug: string = params.printSlug;

    const landscapeImage = (await contentful.getEntries<any>({include: 2, content_type: 'landscapeImage', 'fields.slug': printSlug})).items[0].fields;
    landscapeImage.base64 = (await getPlaiceholder(`https:${landscapeImage.fullResImage.fields.file.url}`)).base64;

    const file = landscapeImage.fullResImage.fields.file;
    const productImageData = await createProductImage(`https:${file.url}`, file.fileName);

    const productImage = {
        ...productImageData,
        base64: (await getPlaiceholder(productImageData.publicFile)).base64
    };

    return {
        props: {
            landscapeImage,
            productImage
        }
    };
}

export const getStaticPaths = async () => {
    const landscapeImagesContentful = (await contentful.getEntries<any>({include: 1, content_type: 'landscapeImage', 'fields.shop': true})).items;

    const landscapeSlugs = landscapeImagesContentful.map(item => item.fields.slug);

    return {
        paths: landscapeSlugs.map(landscapeSlug => ({ params: { printSlug: landscapeSlug }})),
        fallback: false // false or 'blocking'
    };
}