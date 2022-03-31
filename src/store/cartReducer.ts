import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { viewCartEvent } from 'utils/analytics';

export const cartReducer = createSlice( {
    name: 'cart',

    initialState: {
        isOpen: false
    },

    reducers: {
        setIsOpen: ( state, action: PayloadAction<boolean> ) => {
            state.isOpen = action.payload;
            if(state.isOpen) viewCartEvent();
        }
    }
});

export const { setIsOpen } = cartReducer.actions;

export default cartReducer.reducer;