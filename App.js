import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { PersistGate } from "redux-persist/es/integration/react";
import { AuthProvider } from "./src/Hooks/UseAuth";
import AppNavigator from "./src/Navigation/AppNavigator";
import { Provider } from "react-redux";
import { store, persistor } from "./src/Store";
import { initializeApp } from "firebase/app";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { Text, View } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
const Stack = createNativeStackNavigator();
function Notification({ message }) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <View
        style={{
          width: "90%",
          height: 40,
          backgroundColor: "#3498db",
          justifyContent: "center",
          elevation: 1000,
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 10
        }}
      >
        <Text style={{ fontWeight: "bold", color: "white" }}>{message}</Text>
      </View>
    </View>
  );
}
const App = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      setShowNotification(true);
      setNotificationMessage(remoteMessage.notification.body);

      // Hide the notification after some time (e.g., 5 seconds)
      setTimeout(() => {
        setShowNotification(false);
        setNotificationMessage("");
      }, 5000); // 5 seconds

      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl
      });
    });
    return unsubscribe;
  }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <ToastProvider>
              <AppNavigator />
            </ToastProvider>
          </AuthProvider>
        </PersistGate>
      </Provider>
      {showNotification && <Notification message={notificationMessage} />}
    </>
  );
};
export default App;
