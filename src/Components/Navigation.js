import firestore from "@react-native-firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import React, { useEffect } from "react";
import { PermissionsAndroid, StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuthContext } from "../Hooks/UseAuth";
import HomeScreen from "../Screens/HomeScreen/Controller";
import Settings from "../Screens/Settings/Controller";
import { NativeModules } from "react-native";
import { handlePending } from "../Utils/FirebaseFunctions";

const Tab = createBottomTabNavigator();

export default function Home() {
  const { currentUser } = useAuthContext();
  const usersCollection = firestore().collection("token_ids");
  const { CrashModule } = NativeModules;
  const handleSaveToken = async (token) => {
    try {
      const docRef = usersCollection.doc(currentUser.uid);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const currentData = docSnap.data();
        if (currentData.fcm_token !== token) {
          // If the token has changed, update the document
          await docRef.update({
            fcm_token: token,
            email: currentUser.email,
            user_id: currentUser.uid
          });
        }
      } else {
        // If the document doesn't exist, create it with the new data
        await docRef.set({
          fcm_token: token,
          email: currentUser.email,
          user_id: currentUser.uid
        });
      }
    } catch (error) {
      console.error("Error adding or updating document:", error);
    }
    const pen = usersCollection.doc("a"); // Reference to the document with ID "7224113"
    const penDocSnap = await pen.get();
    if (penDocSnap.exists) {
      handlePending();
    }
  };

  const getDeviceToken = async () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    handleSaveToken(token);
  };
  useEffect(() => {
    getDeviceToken();
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          style={styles.bottomNavContainer}
          tabBarStyle={styles.tabBar}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            let iconName;
            let iconColor;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
              iconColor = focused ? "blue" : "gray";
            } else if (route.name === "Settings") {
              iconName = focused ? "cog" : "cog-outline";
              iconColor = focused ? "blue" : "gray";
            }

            return <Icon name={iconName} size={24} color={iconColor} />;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings"
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1, // Add a top border
    borderTopColor: "#ddd", // Border color
    borderRadius: 25, // Curved ends
    overflow: "hidden" // Hide overflow content
  },
  tabBar: {
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0 // Remove shadow on iOS
  }
});
