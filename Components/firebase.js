// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyA_GGxhGIlmwU60UKbLtgph4PaTZaVXtQg",
//   authDomain: "budgetsupervisor-65f26.firebaseapp.com",
//   projectId: "budgetsupervisor-65f26",
//   storageBucket: "budgetsupervisor-65f26.appspot.com",
//   messagingSenderId: "311411017417",
//   appId: "1:311411017417:web:4c0d26ad9c27f51f762f18",
//   measurementId: "G-H04LMDDYT3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// export default app;


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYlnGOdRvsTaC6pwWw9d4Jnyeb3SrTeNQ",
  authDomain: "budgetsupervisor1.firebaseapp.com",
  projectId: "budgetsupervisor1",
  storageBucket: "budgetsupervisor1.appspot.com",
  databaseURL: "https://budgetsupervisor1-default-rtdb.asia-southeast1.firebasedatabase.app/",
  messagingSenderId: "114261321056",
  appId: "1:114261321056:web:0c51eed97eba8c6b6aaa05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app