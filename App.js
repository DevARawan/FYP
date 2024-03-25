import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";


import { AuthProvider } from "./src/Hooks/UseAuth";
import AppNavigator from "./src/Navigation/AppNavigator";

const Stack = createNativeStackNavigator();

const App = () => {
  


  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};
export default App;
