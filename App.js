import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthProvider } from "./src/Hooks/UseAuth";
import AppNavigator from "./src/Navigation/AppNavigator";

const Stack = createNativeStackNavigator();

const App = () => {
  
  GoogleSignin.configure();

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};
export default App;
