import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { useAppSelector, useAppDispatch } from 'hooks/storeHooks';
import { setIsOpen } from 'store/cartReducer';

import Button from 'components/Button';

interface Props {
};

const Cart: React.FC<Props>  = () => {
    const isOpen = useAppSelector(state => state.cart.isOpen);
    const dispatch = useAppDispatch();

    const onClose = () => {
        dispatch(setIsOpen(false));
    };

    return (
        <div className="relative z-50 text-lightPrimary">
            <div className={`fixed inset-0 bg-gray-800 transition-opacity duration-300 w-full h-full ${isOpen ? 'opacity-60 block' : 'opacity-0 hidden'}`} onClick={onClose} />
            <div className={`fixed right-0 top-0 h-full border-2 bg-darkSecondary overflow-y-auto transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full justify-between max-w-sm p-6 sm:p-10">
                    <div className="space-y-4">
                        <div className="w-full flex justify-between">
                            <h2 className="font-semibold">Your cart</h2>
                            <button className="ml-2" onClick={onClose}>
                                <FontAwesomeIcon icon={['fas', 'times']} size="2x"/>
                            </button>
                        </div>
                        <ul className="flex flex-col divide-y divide-coolGray-700">
                            <li className="flex flex-col py-6 sm:flex-row sm:justify-between">
                                <div className="flex w-full space-x-2 sm:space-x-4">
                                <img className="flex-shrink-0 object-cover w-20 h-20 border-transparent rounded outline-none sm:w-32 sm:h-32 bg-coolGray-500" src="https://images.unsplash.com/photo-1504274066651-8d31a536b11a?ixlib=rb-1.2.1&amp;ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&amp;auto=format&amp;fit=crop&amp;w=675&amp;q=80" alt="Replica headphones" />
                                    <div className="flex flex-col justify-between w-full pb-4">
                                        <div className="flex justify-between w-full pb-2 space-x-2">
                                            <div className="space-y-1">
                                                <h3 className="leading-snug sm:pr-8">Sand Blow</h3>
                                                <p className="text-sm text-coolGray-400">Classic</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-semibold">$59.99</span>
                                            </div>
                                        </div>
                                        <div className="flex text-sm divide-x">
                                            <button type="button" className="flex items-center px-2 py-1 pl-0 space-x-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current">
                                                    <path d="M96,472a23.82,23.82,0,0,0,23.579,24H392.421A23.82,23.82,0,0,0,416,472V152H96Zm32-288H384V464H128Z"></path>
                                                    <rect width="32" height="200" x="168" y="216"></rect>
                                                    <rect width="32" height="200" x="240" y="216"></rect>
                                                    <rect width="32" height="200" x="312" y="216"></rect>
                                                    <path d="M328,88V40c0-13.458-9.488-24-21.6-24H205.6C193.488,16,184,26.542,184,40V88H64v32H448V88ZM216,48h80V88H216Z"></path>
                                                </svg>
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1 text-right">
                            <h4>Total: <span className="font-semibold">$357</span></h4>
                            <h5 className="text-sm text-coolGray-400">Not including taxes and shipping costs</h5>
                        </div>
                        <div className="flex space-x-4">
                            <Button type="transparent" clickable onClick={onClose}>
                                Back to shop
                            </Button>
                            <Button type="filled" clickable>
                                Continue to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;