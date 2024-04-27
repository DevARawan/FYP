import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Logo } from "../Components/Logo";
import Home from "../Components/Navigation";
import { useAuthContext } from "../Hooks/UseAuth";
import Achievements from "../Screens/Achievements";
import DataEntry from "../Screens/DataEntry";
import General from "../Screens/CurrencyPreferences";
import LoginScreen from "../Screens/LoginScreen";
import ManageGoals from "../Screens/ManageGoals";
import FrontScreen from "../Screens/IntroScreen";
import SignUpScreen from "../Screens/SignUpScreen/ViewController";
import UserProfile from "../Screens/UserProfile";
import PrivacyPolicy from "../Screens/PrivacyPolicy";
import LeaderboardScreen from "../Screens/Leaderboard";
import FinancialReport from "../Screens/FinancialReports";
import ExpenseReportScreen from "../Screens/ExpenseReports";
import AdminScreen from "../Screens/Admin/ViewController";
import GoalsChartScreen from "../Screens/Admin/GoalCompletionsReport";

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { currentUser } = useAuthContext();
  const RenderInitialScreen = () => {
    if (currentUser === null) {
      return <FrontScreen />;
    } else {
      return <Home />;
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
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="main"
          component={Home}
          options={({ navigation }) => ({
            title: "BudgetSupervisor",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}></View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="FrontScreen"
          component={FrontScreen}
          options={({ navigation }) => ({
            title: "BudgetSupervisor",
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="data Entry"
          component={Home}
          options={({ navigation }) => ({
            title: "my App",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}></View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />
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
            headerRight: () => <Logo />
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
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={({ navigation }) => ({
            title: "Login",
            headerRight: () => <Logo />
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
            headerRight: () => <Logo />
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
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="FinancialReport"
          component={FinancialReport}
          options={({ navigation }) => ({
            title: "FinancialReport",
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
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="AdminReport"
          component={GoalsChartScreen}
          options={({ navigation }) => ({
            title: "FinancialReport",
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
            headerRight: () => <Logo />
          })}
        />

        <Stack.Screen
          name="ExpensesReport"
          component={ExpenseReportScreen}
          options={({ navigation }) => ({
            title: "ExpensesReport",
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
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={({ navigation }) => ({
            title: "Privacy Policy",
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
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen
          name="CurrencyPreferences"
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
            headerRight: () => <Logo />
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
                    style={{ fontSize: 24, color: "black" }}
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />
          })}
        />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
