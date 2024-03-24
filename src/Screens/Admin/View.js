
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { fetchAllUsers } from '../../Utils/FirebaseFunctions';
import { deleteDoc } from 'firebase/firestore';



const AdminView = ({  
  navigation,
  usersData
 
})  => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [users, setUsers] = useState([]);
      const handleOptions = (user) => {
        setSelectedUser(user);
        setShowOptionsModal(true);
      };
      const handleDeleteUser = async () => {
        // Check if selectedUser has an ID
        if (!selectedUser?.user_id) {
          console.error('Selected user is missing an ID');
          return;
        }
      
        try {
          // Create a reference to the user document
          const userDocRef = doc(FIREBASE_DB, 'users', selectedUser.user_id);
      
          // Delete the document
          await deleteDoc(userDocRef);
      
          // Update local state (optional, data might already be outdated)
          const updatedUsers = users.filter(u => u.user_id !== selectedUser.user_id);
          setUsers(updatedUsers);
      
          console.log('User deleted successfully!');
        } catch (error) {
          console.error('Error deleting user:', error);
        } finally {
          setShowOptionsModal(false); // Close the modal regardless of success or failure
        }
      };
      
      const renderItem = ({ item }) => (
        <View style={styles.item}>
          <Text>{item.email}</Text>
          <TouchableOpacity onPress={() => handleOptions(item)} style={styles.optionsButton}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
      React.useEffect(() => {
        const fetchData = async () => {
          const allUsers = await fetchAllUsers();
          console.log('all users',allUsers )
          setUsers(allUsers)
        };
        fetchData();
      }, []);
      return (
        <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={showOptionsModal}
          onRequestClose={() => setShowOptionsModal(false)}
        >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Button title="Delete User" onPress={handleDeleteUser} />
              <Button title="Cancel" onPress={() => setShowOptionsModal(false)} />
            </View>
          </View>
        </Modal>
      </View>
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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionsButton: {
    marginLeft: 10,
  },
});
