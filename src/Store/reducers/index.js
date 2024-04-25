// store/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import currenncyReducer from "./currenncyReducer";
import userReducer from "./UserSlice";
// Import individual reducer files here

const rootReducer = combineReducers({
  currency: currenncyReducer,
  user: userReducer
  // Add reducers here
});

export default rootReducer;
