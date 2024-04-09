// store/reducers/currencySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: {
    id: "PKR",
    name: "Pakistani Rupee",
    symbol: "Rs"
  } // Initial currency
};

const currencySlice = createSlice({
  name: "currency",
  initialState: initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    }
  }
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
