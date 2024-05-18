// savingSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savingAmount: 0
};

const savingSlice = createSlice({
  name: "saving",
  initialState,
  reducers: {
    setSavingAmount(state, action) {
      state.savingAmount = action.payload;
    }
  }
});

export const { setSavingAmount } = savingSlice.actions;

export default savingSlice.reducer;
