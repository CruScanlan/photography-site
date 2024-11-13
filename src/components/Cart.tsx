import React, { useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useShoppingCart } from 'use-shopping-cart';
import { Product } from "use-shopping-cart/core";
import { useAppSelector, useAppDispatch } from 'hooks/storeHooks';
import { setIsOpen } from 'store/cartReducer';

import { addToCartEvent, beginCheckoutEvent, removeFromCartEvent } from 'utils/analytics';

import getStripe from 'utils/get-stripejs';
import { fetchPostJSON } from 'utils/api-helpers';

import Button from 'components/Button';

interface Props {

};

const Cart: React.FC<Props>  = () => {
    const isOpen = useAppSelector(state => state.cart.isOpen);
    const dispatch = useAppDispatch();

    const { 
        cartDetails,
        cartCount,
        incrementItem,
        decrementItem,
        removeItem,
        formattedTotalPrice,
        redirectToCheckout
    } = useShoppingCart();

    const onClose = () => {
        dispatch(setIsOpen(false));
    };

    const cartItems: Product[] = (Object.entries(cartDetails).map(entry => entry[1])) as any;

    const onClickReduceQuantity = (id: string) => {
        decrementItem(id);
        removeFromCartEvent(cartDetails[id]);
    }

    const onClickIncreaseQuantity = (id: string) => {
        incrementItem(id);
        addToCartEvent(cartDetails[id]);
    }

    const onClickRemove = (id: string) => {
        removeItem(id);
        removeFromCartEvent(cartDetails[id], true);
    }

    const onClickCheckout = async () => {
        // Create a Checkout Session.
        const response = await fetchPostJSON('/api/checkout_sessions', cartItems);
    
        if (response.statusCode === 500) {
            console.error(response.message);
            return
        }

        beginCheckoutEvent(cartItems);
        
        //redirectToCheckout({ sessionId: response.id });
    }

    return (
        (<div className="relative z-50 text-lightPrimary">
            <div className={`fixed inset-0 bg-gray-800 transition-opacity duration-300 w-full h-full ${isOpen ? 'opacity-60 block' : 'opacity-0 hidden'}`} onClick={onClose} />
            <div className={`fixed right-0 top-0 h-full border-2 bg-darkSecondary overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full justify-between max-w-lg p-4 sm:p-8">
                    <div className="space-y-4">
                        <div className="w-full flex justify-between">
                            <h2 className="font-semibold">Your cart</h2>
                            <button className="ml-2" onClick={onClose}>
                                <FontAwesomeIcon icon={['fas', 'times']} size="2x"/>
                            </button>
                        </div>
                        <ul className="flex flex-col divide-y divide-coolGray-700">
                            {
                                cartCount === 0 && (
                                    <h4 className="py-6">
                                        No Items In Cart
                                    </h4>
                                )
                            }
                            {
                                cartItems.map((cartItem: any) => (
                                    <li className="flex flex-col py-6 sm:flex-row sm:justify-between" key={cartItem.id}>
                                        <div className="flex w-full space-x-2 sm:space-x-4">
                                        <img 
                                            className="flex-shrink-0 object-cover w-20 h-20 border-transparent rounded outline-none sm:w-28 sm:h-28 bg-coolGray-500" 
                                            src={cartItem.product_metadata.printImageSrc}
                                        />
                                        <div className="flex flex-col justify-between w-full py-1">
                                            <div className="flex justify-between w-full pb-2 space-x-2">
                                                <div className="space-y-1">
                                                    <h3 className="leading-snug sm:pr-8">
                                                        <Link
                                                            href={`/store/print/${cartItem.product_metadata.printSlug}`}
                                                            className="hover:underline"
                                                            onClick={onClose}>

                                                            {cartItem.name}

                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm text-coolGray-400">{cartItem.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <div className="flex space-x-2">
                                                    <div className="flex items-center font-semibold space-x-2 bg-lightPrimary">
                                                        <button className="px-2 py-1 font-bold text-darkTertiary hover:bg-orange-500" onClick={() => onClickReduceQuantity(cartItem.id)}>-</button>
                                                        <span className="py-1 text-secondary text-darkSecondary">{cartItem.quantity}</span>
                                                        <button className="px-2 py-1 font-bold text-darkTertiary hover:bg-orange-500" onClick={() => onClickIncreaseQuantity(cartItem.id)}>+</button>
                                                    </div>
                                                    <button type="button" className="flex items-center px-2 pl-0 hover:text-orange-500" onClick={() => onClickRemove(cartItem.id)}>
                                                        <div className="space-x-1">
                                                            <FontAwesomeIcon icon={["fas", "trash"]} />
                                                            <span>Remove</span>
                                                        </div> 
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-semibold">{cartItem.formattedValue.split('A').join('')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="space-y-4">
                        {
                            cartCount > 0 && (
                                <>
                                    <div className="space-y-1 text-right">
                                        <h4>Total: <span className="font-semibold">{formattedTotalPrice.split('A').join('')}</span></h4>
                                        <h5 className="text-sm text-coolGray-400">Not including shipping costs</h5>
                                    </div>
                                    <div className="flex space-x-4">
                                        <Button type="transparent" clickable onClick={onClose}>
                                            Back to shop
                                        </Button>
                                        <Button type="filled" clickable onClick={onClickCheckout}>
                                            Continue to Checkout
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                        {
                            cartCount === 0 && (
                                <Button type="transparent" clickable onClick={onClose}>
                                    Back to shop
                                </Button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>)
    );
};

export default Cart;