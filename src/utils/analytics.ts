import { Product } from "use-shopping-cart/core";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

const gtag = window.gtag;

export const addToCartEvent = (product: Product) => {
    gtag('event', 'add_to_cart', {
        currency: product.currency,
        value: product.price/100,
        items: [
            {
                item_id: product.id,
                item_name: `${product.name} - ${product.description}`,
                price: product.price/100,
                quantity: 1
            }
        ]
    });
}

export const viewCartEvent = () => {
    gtag('event', 'view_cart');
}

export const beginCheckoutEvent = (products: Product[]) => {
    gtag('event', 'begin_checkout', {
        items: products.map(product => ({
            item_id: product.id,
            item_name: `${product.name} - ${product.description}`,
            price: product.price/100,
            quantity: product.quantity
        }))
    });
}

export const removeFromCartEvent = (product: Product, all: boolean = false) => {
    gtag('event', 'remove_from_cart', {
        currency: product.currency,
        value: product.price/100,
        items: [
            {
                item_id: product.id,
                item_name: `${product.name} - ${product.description}`,
                price: product.price/100,
                quantity: all ? product.quantity : 1 //If all is true, remove all of the item
            }
        ]  
    })
}