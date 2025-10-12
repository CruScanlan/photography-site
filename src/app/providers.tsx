'use client';

import { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store, { persistor } from 'store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { CartProvider } from 'use-shopping-cart';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { 
  faArrowCircleRight, 
  faChevronRight, 
  faChevronLeft, 
  faTimes, 
  faBars, 
  faChevronDown, 
  faCartArrowDown, 
  faCircleCheck, 
  faTruckFast, 
  faShield, 
  faPaintBrush, 
  faShoppingCart, 
  faTrash, 
  faMasksTheater 
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faFacebook, faMastodon } from '@fortawesome/free-brands-svg-icons';

// Configure FontAwesome
config.autoAddCss = false;

// Add icons to library
library.add(
    faArrowCircleRight, 
    faChevronRight,
    faChevronLeft,
    faChevronDown,
    faTimes,
    faBars,
    faInstagram,
    faMastodon,
    faFacebook,
    faCartArrowDown,
    faPaintBrush,
    faCircleCheck,
    faTruckFast,
    faShield,
    faShoppingCart,
    faTrash
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CartProvider
          cartMode="checkout-session"
          stripe={process.env.NEXT_PUBLIC_STRIPE_KEY_PUBLISHABLE || ''}
          currency="AUD"
        >
          {children}
        </CartProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

