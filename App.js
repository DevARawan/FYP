// import { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
 //import { Image, View, TouchableOpacity } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
 //import { FontAwesome5 } from '@expo/vector-icons';
// import HomeScreen from './HomeScreen';
// import SignupScreen from './SignupScreen';
// import LoginScreen from './LoginScreen';
// import Screen1 from './Screen1';
// import DataEntry from './DataEntry';
// import ManageGoals from './ManageGoals';
// import UserProfile from './UserProfile';
// import Settings from './Settings';
// import PrivacyPolicy from './PrivacyPolicy';
// import General from './General';
// import Achievements from './Achievements';

// export default function App() {
//   const stack = createNativeStackNavigator();
//   const [userExist, setuserExist] = useState();
//   const getUserfromAsync = async ()=>{
//     let user = await AsyncStorage.getItem('isUserLoggedin');
//     if(user === "true"){
//     setuserExist("true") }
//   }
// useEffect(()=>{
//   getUserfromAsync();
// },[]);

//   return (
//     <NavigationContainer>
//       <stack.Navigator screenOptions={{
//           // headerStyle: {
//           //    // your header styles here
//           // },
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//           headerTitleAlign: 'center',
//         }}
//       >

//       {userExist ==="true" ?
//           <stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={({ navigation }) => ({
//             title: 'Home',
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <View style={{ marginLeft: 10 }}>
//                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                 </View>
//               </TouchableOpacity>
//             ),
//             headerRight: () => <Logo />,
//           })}
//         />

//       //   <stack.Screen
//       //   name="login"
//       //   component={LoginScreen}
//       //   options={({ navigation }) => ({
//       //     title: 'Login',
//       //     headerLeft: () => (
//       //       <TouchableOpacity onPress={() => navigation.goBack()}>
//       //         <View style={{ marginLeft: 10 }}>
//       //           <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//       //         </View>
//       //       </TouchableOpacity>
//       //     ),
//       //     headerRight: () => <Logo />,
//       //   })}
//       // />

//       :

//       <stack.Screen
//           name="screen1"
//           component={Screen1}
//           options={({ navigation }) => ({
//             title: 'Screen 1',
//             // headerLeft: () => (
//             //   <TouchableOpacity onPress={() => navigation.goBack()}>
//             //     <View style={{ marginLeft: 10 }}>
//             //       <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//             //     </View>
//             //   </TouchableOpacity>
//             // ),
//             headerRight: () => <Logo />,
//           })}
//         />
//         }
//         <stack.Screen
//           name="screen11"
//           component={Screen1}
//           options={({ navigation }) => ({
//             title: 'Screen 1',
//             // headerLeft: () => (
//             //   <TouchableOpacity onPress={() => navigation.goBack()}>
//             //     <View style={{ marginLeft: 10 }}>
//             //       <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//             //     </View>
//             //   </TouchableOpacity>
//             // ),
//             headerRight: () => <Logo />,
//           })}
//         />

//        <stack.Screen
//         name="login"
//         component={LoginScreen}
//         options={({ navigation }) => ({
//           title: 'Login',
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <View style={{ marginLeft: 10 }}>
//                 <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//               </View>
//             </TouchableOpacity>
//           ),
//           headerRight: () => <Logo />,
//         })}
//       />

//       <stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={({ navigation }) => ({
//             title: 'Signup',
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <View style={{ marginLeft: 10 }}>
//                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                 </View>
//               </TouchableOpacity>
//             ),
//             headerRight: () => <Logo />,
//           })}
//         />

//         <stack.Screen
//           name="Main"
//           component={HomeScreen}
//           options={({ navigation }) => ({
//             title: 'Home',
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <View style={{ marginLeft: 10 }}>
//                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                 </View>
//               </TouchableOpacity>
//             ),
//             headerRight: () => <Logo />,
//           })}
//         />

//         <stack.Screen
//           name="Home11"
//           component={HomeScreen}
//           options={({ navigation }) => ({
//             title: 'Home1',
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <View style={{ marginLeft: 10 }}>
//                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                 </View>
//               </TouchableOpacity>
//             ),
//             headerRight: () => <Logo />,
//           })}
//         />

// <stack.Screen
//           name="dataEntry"
//           component={DataEntry}
//           options={({ navigation }) => ({
//             title: 'Data Entry',
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <View style={{ marginLeft: 10 }}>
//                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                 </View>
//               </TouchableOpacity>
//             ),
//             headerRight: () => <Logo />,
//           })}
//         />

//         <stack.Screen
//           name="manageGoals"
//           component={ManageGoals}
//           options={({ navigation }) => ({
//             title: 'Manage Goals',
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <View style={{ marginLeft: 10 }}>
//                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                 </View>
//               </TouchableOpacity>
//             ),
//             headerRight: () => <Logo />,
//           })}
//         />
//            <stack.Screen
//            name="profile"
//            component={UserProfile}
//            options={({ navigation }) => ({
//              title: 'Profile',
//              headerLeft: () => (
//                <TouchableOpacity onPress={() => navigation.goBack()}>
//                  <View style={{ marginLeft: 10 }}>
//                    <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                  </View>
//                </TouchableOpacity>
//              ),
//              headerRight: () => <Logo />,
//            })}
//          />

// <stack.Screen
//           name="settings"
//           component={Settings}
//           options={({ navigation }) => ({
//             title: 'Settings',
//             headerLeft: () => (
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <View style={{ marginLeft: 10 }}>
//                   <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                 </View>
//               </TouchableOpacity>
//             ),
//             headerRight: () => <Logo />,
//           })}
//         />

// <stack.Screen
//         name="Achievements"
//         component={Achievements}
//         options={({ navigation }) => ({
//           title: 'Home',
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <View style={{ marginLeft: 10 }}>
//                 <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//               </View>
//             </TouchableOpacity>
//           ),
//           headerRight: () => <Logo />,
//         })}
//       />

//           <stack.Screen
//            name="policy"
//            component={PrivacyPolicy}
//            options={({ navigation }) => ({
//              title: 'Privacy policy',
//              headerLeft: () => (
//                <TouchableOpacity onPress={() => navigation.goBack()}>
//                  <View style={{ marginLeft: 10 }}>
//                    <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                  </View>
//                </TouchableOpacity>
//              ),
//              headerRight: () => <Logo />,
//            })}
//          />

// <stack.Screen
//            name="general"
//            component={General}
//            options={({ navigation }) => ({
//              title: 'General Settings',
//              headerLeft: () => (
//                <TouchableOpacity onPress={() => navigation.goBack()}>
//                  <View style={{ marginLeft: 10 }}>
//                    <FontAwesome5 name="arrow-left" style={{ fontSize: 24, color: 'black' }} />
//                  </View>
//                </TouchableOpacity>
//              ),
//              headerRight: () => <Logo />,
//            })}
//          />

//       </stack.Navigator>
//     </NavigationContainer>

//   );
// }
// export const Logo = () => (
// <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 1 }}>
//     <Image
//       source={require('./Images/mylogo.png')}
//       style={{ width: 65, height: 61, borderRadius: 10, overflow: 'hidden' }}
//     />
//   </View>
// );

//App.js;
import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyComponent from "./Components/Navigation";
import DataEntry from "./DataEntry";
import LoginScreen from "./LoginScreen";
import Screen1 from './Screen1';
import SignupScreen from './SignupScreen';
import ManageGoals from './ManageGoals';
import UserProfile from './UserProfile';
import General from "./General";
import Achievements from "./Achievements";
import Settings from "./Settings";
import HomeScreen from "./HomeScreen";
import { View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 

const Stack = createNativeStackNavigator();

export default function App() {
  const [userExist, setUserExist] = useState(null);

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
      console.log("null");
      return <Screen1 />;
      
    } else if (userExist) {
      console.log("NOT null");
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
          name="screen1"
          component={Screen1}
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
          component={SignupScreen}
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
           name="general"
           component={General}
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
      source={require('./Images/mylogo.png')}
      style={{ width: 65, height: 61, borderRadius: 10, overflow: 'hidden' }}
    />
  </View>
);
