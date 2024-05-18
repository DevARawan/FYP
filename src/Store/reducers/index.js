// store/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import currenncyReducer from "./currenncyReducer";
import userReducer from "./UserSlice";
import savingReducer from "./SavingsSlice";
// Import individual reducer files here

const rootReducer = combineReducers({
  currency: currenncyReducer,
  user: userReducer,
  saving: savingReducer
  // Add reducers here
});

export default rootReducer;
