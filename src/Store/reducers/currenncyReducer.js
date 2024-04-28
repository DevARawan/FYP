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
      { name: "Meezan Bank", url: "https://www.meezanbank.com/easy-home/" },
      {
        name: "UBL",
        url: "https://www.ubldigital.com/Loans/Consumer-Loans/UBL-Cash-Plus"
      },
      {
        name: "Bank Alfalah",
        url: "https://www.bankalfalah.com/personal-banking/loans/alfalah-personal-loan/"
      },
      {
        name: "Askari Bank",
        url: "https://askaribank.com/personal/consumer-products/personal-finance/"
      }
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
