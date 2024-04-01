
//------------------------------------------------------------------------------------------------------

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../Screens/HomeScreen';
import Settings from '../Screens/Settings';
import AdminScreen from '../Screens/Admin/ViewController';

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          style={styles.bottomNavContainer}
          tabBarStyle={styles.tabBar}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            let iconName;
            let iconColor;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
              iconColor = focused ? 'blue' : 'gray';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog' : 'cog-outline';
              iconColor = focused ? 'blue' : 'gray';
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
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
        }}
      />    
      <Tab.Screen
        name="Admin"
        component={AdminScreen}
        options={{
          tabBarLabel: 'Admin',
        }}
    />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bottomNavContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1, // Add a top border
    borderTopColor: '#ddd', // Border color
    borderRadius: 25, // Curved ends
    overflow: 'hidden', // Hide overflow content
  },
  tabBar: {
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
  },
});


