



import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import UserItem from './UserItem';



const AdminView = ({  
  navigation,
 
})  => {
    const handleOptionPress = (option, userId) => {
        // Handle option selection based on option and userId
        console.log(`Option: ${option}, User ID: ${userId}`);
      };
    
      return (
        <FlatList
          data={usersData}
          renderItem={({ item }) => <UserItem user={item} onOptionPress={handleOptionPress} />}
          keyExtractor={(item) => item.id.toString()} // Unique key for each item
        />
      );

}
export default AdminView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
