import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyAYlnGOdRvsTaC6pwWw9d4Jnyeb3SrTeNQ",
  authDomain: "budgetsupervisor1.firebaseapp.com",
  databaseURL:
    "https://budgetsupervisor1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "budgetsupervisor1",
  storageBucket: "budgetsupervisor1.appspot.com",
  messagingSenderId: "114261321056",
  appId: "1:114261321056:web:0c51eed97eba8c6b6aaa05"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
