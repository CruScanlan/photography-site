import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const cartReducer = createSlice( {
    name: 'cart',

    initialState: {
        isOpen: false
    },

    reducers: {
        setIsOpen: ( state, action: PayloadAction<boolean> ) => {
            state.isOpen = action.payload;
        }
    }
});

export const { setIsOpen } = cartReducer.actions;

export default cartReducer.reducer;