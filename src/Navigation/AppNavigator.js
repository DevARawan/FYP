import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import MyComponent from "../Components/Navigation";
import Achievements from "../Screens/Achievements";
import DataEntry from "../Screens/DataEntry";
import General from "../Screens/General";
import LoginScreen from "../Screens/LoginScreen";
import ManageGoals from "../Screens/ManageGoals";
import Screen1 from "../Screens/Screen1";
import SignUpScreen from "../Screens/SignUpScreen/ViewController";
import UserProfile from "../Screens/UserProfile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Logo } from "../Components/Logo";
import { useAuthContext } from "../Hooks/UseAuth";

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { currentUser } = useAuthContext();
  console.log('currentUser',currentUser)
  const RenderInitialScreen = () => {
    if (currentUser === null) {
      return <Screen1 />;
    } else if (currentUser) {
      return <MyComponent />;
    } else {
      return <Screen1 />;
    }
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="InitialScreen"
          component={RenderInitialScreen}
          options={({ navigation }) => ({
            title: "BudgetSupervisor",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}></View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="main"
          component={MyComponent}
          options={({ navigation }) => ({
            title: "BudgetSupervisor",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}></View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="screen1"
          component={Screen1}
          options={({ navigation }) => ({
            title: "BudgetSupervisor",
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="data Entry"
          component={MyComponent}
          options={({ navigation }) => ({
            title: "my App",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}></View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="dataEntry"
          component={DataEntry}
          options={({ navigation }) => ({
            title: "Data Entry",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5
                    name="arrow-left"
                    style={{ fontSize: 24, color: "black" }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="manageGoals"
          component={ManageGoals}
          options={({ navigation }) => ({
            title: "Manage Goals",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5
                    name="arrow-left"
                    style={{ fontSize: 24, color: "black" }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={({ navigation }) => ({
            title: "Login",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5
                    name="arrow-left"
                    style={{ fontSize: 24, color: "black" }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="Signup"
          component={SignUpScreen}
          options={({ navigation }) => ({
            title: "Signup",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5
                    name="arrow-left"
                    style={{ fontSize: 24, color: "black" }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="profile"
          component={UserProfile}
          options={({ navigation }) => ({
            title: "Profile",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5
                    name="arrow-left"
                    style={{ fontSize: 24, color: "black" }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="general"
          component={General}
          options={({ navigation }) => ({
            title: "General Settings",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5
                    name="arrow-left"
                    style={{ fontSize: 24, color: "black" }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="Achievements"
          component={Achievements}
          options={({ navigation }) => ({
            title: "Achievements",
            // headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View>
                  <FontAwesome5
                    name="arrow-left"
                    style={{ fontSize: 24, color: "black", paddingright: 10 }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator
