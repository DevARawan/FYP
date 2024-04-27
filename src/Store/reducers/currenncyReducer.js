// store/reducers/currencySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency: {
    id: "PKR",
    name: "Pakistani Rupee",
    symbol: "Rs",
    websites: [
      { name: "EasyPaisa", url: "https://www.easypaisa.com.pk/" },
      { name: "JazzCash", url: "https://www.jazzcash.com.pk/" },
      { name: "Rizq", url: "https://www.rizq.com/" },
      { name: "Meezan Bank", url: "https://www.meezanbank.com/" },
      { name: "UBL", url: "https://www.ubldigital.com/" },
      { name: "Bank Alfalah", url: "https://www.bankalfalah.com/" },
      { name: "Askari Bank", url: "https://askaribank.com/" }
    ]
  }
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
