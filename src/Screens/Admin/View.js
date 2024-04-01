import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthContext } from "../../Hooks/UseAuth";

const AdminView = ({
  navigation,
  selectedUser,
  setSelectedUser,
  showOptionsModal,
  setShowOptionsModal,
  users,
  setUsers,
  handleOptions,
  handleDeleteUser,
}) => {

  const { currentUser } = useAuthContext();
  console.log('currentUser',currentUser)
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.email}</Text>
      <TouchableOpacity
        onPress={() => handleOptions(item)}
        style={styles.optionsButton}
      >
        <MaterialIcons name="more-vert" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item}
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
};
export default AdminView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionsButton: {
    marginLeft: 10,
  },
});
