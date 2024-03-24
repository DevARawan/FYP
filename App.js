
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DataEntry from './src/Screens/DataEntry'
import LoginScreen from "./src/Screens/LoginScreen";
// import Screen1 from './src/Screens/IntroScreen';
import FrontScreen from "./src/Screens/IntroScreen";
import SignUpScreen from "./src/Screens/SignUpScreen/ViewController";
import ManageGoals from './src/Screens/ManageGoals';
import UserProfile from './src/Screens/UserProfile';
// import General from "./src/Screens/CurrencyPreferences";
import CurrencyPreferences from "./src/Screens/CurrencyPreferences";
import Achievements from "./src/Screens/Achievements";
import { View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MyComponent from "./src/Components/Navigation";

const Stack = createNativeStackNavigator();

const  App = () => {
  const [userExist, setUserExist] = useState(null);
  GoogleSignin.configure();
  useEffect(() => {
    const getUserFromAsync = async () => {
      
      let user = await AsyncStorage.getItem('user');
      console.log(user);
      setUserExist(JSON.parse(user) );
    };
    getUserFromAsync();
  }, []);


  const RenderInitialScreen = () => {
    if (userExist === null) {
      return <FrontScreen />;
      
    } else if (userExist) {
      return <MyComponent />;
    } else {
      return <FrontScreen />;
    }
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="InitialScreen"
          component={RenderInitialScreen}
          options={({ navigation }) => ({
            title: 'BudgetSupervisor',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="main"
          component={MyComponent}
          options={({ navigation }) => ({
            title: 'BudgetSupervisor',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => <Logo />,
          })}
        />
        <Stack.Screen
          name="FrontScreen"
          component={FrontScreen}
          options={({ navigation }) => ({
            title: 'BudgetSupervisor',
            // headerLeft: () => (
            //   <TouchableOpacity onPress={() => navigation.goBack()}>
            //     <View style={{ marginLeft: 10 }}>
            //     </View>
            //   </TouchableOpacity>
            // ),
            headerRight: () => <Logo />,
          })}
        />
        
        
        
        <Stack.Screen
        
        name="data Entry"
        component={MyComponent}
        options={({ navigation }) => ({
          title: 'my App',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ marginLeft: 10 }}>
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => <Logo />,
        })} 
      />
        <Stack.Screen
          name="dataEntry"
          component={DataEntry}
          options={({ navigation }) => ({
            title: 'Data Entry',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
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
            title: 'Manage Goals',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
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
            title: 'Login',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
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
            title: 'Signup',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ marginLeft: 10 }}>
                  <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
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
             title: 'Profile',
             headerLeft: () => (
               <TouchableOpacity onPress={() => navigation.goBack()}>
                 <View style={{ marginLeft: 10 }}>
                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
                 </View>
               </TouchableOpacity>
             ),
             headerRight: () => <Logo />,
           })}
         />
          <Stack.Screen
           name="CurrencyPreferences"
           component={CurrencyPreferences}
           options={({ navigation }) => ({
             title: 'General Settings',
             headerLeft: () => (
               <TouchableOpacity onPress={() => navigation.goBack()}>
                 <View style={{ marginLeft: 10 }}>
                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
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
          title: 'Achievements',
          // headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View>
              <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black', paddingright:10 }} />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => <Logo />,
        })}
      />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export const Logo = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 1 }}>
    <Image
      source={require('./src/Images/mylogo.png')}
      style={{ width: 65, height: 61, borderRadius: 10, overflow: 'hidden' }}
    />
  </View>
);
export default App