// store/reducers/index.js
import { combineReducers } from "@reduxjs/toolkit";
import currenncyReducer from "./currenncyReducer";
// Import individual reducer files here

const rootReducer = combineReducers({
  currency: currenncyReducer
  // Add reducers here
});

export default rootReducer;
