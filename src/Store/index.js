// store.js
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "./reducers"; // Your root reducer

const persistConfig = {
  key: "root", // key is required, it is used to define where in your persistence layer you'd like to store the data.
  storage: AsyncStorage, // AsyncStorage for React Native
  whitelist: [] // Add any additional configuration here...
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
