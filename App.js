import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { PersistGate } from "redux-persist/es/integration/react";
import { AuthProvider } from "./src/Hooks/UseAuth";
import AppNavigator from "./src/Navigation/AppNavigator";
import { Provider } from "react-redux";
import { store, persistor } from "./src/Store ";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
};
export default App;
