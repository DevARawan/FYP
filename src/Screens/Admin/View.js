import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuthContext } from "../../Hooks/UseAuth";
import Loader from "../../Utils/Loader";
import { Button } from "react-native";
import { useSelector } from "react-redux";

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
  loading,
  handlePromoteToAdmin,
  selectedUserAction
}) => {
  const { currentUser } = useAuthContext();
  const user = useSelector((state) => state.user.user);
  const renderItem = ({ item }) => (
    <View>
      <View
        style={[
          styles.itemContainer,

          {
            backgroundColor:
              item.user_id == currentUser.uid ? "#007AFF" : "white"
          }
        ]}
      >
        <Text style={styles.emailText}>{item.email}</Text>
        <Text style={styles.adminText}>{item.isAdmin ? "Admin" : "User"}</Text>
        {!item.isSuperAdmin && (
          <TouchableOpacity onPress={() => handleOptions(item)}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View>
              <Button
                title="See Financial Reports"
                onPress={() => {
                  navigation.navigate("AdminReport");
                }}
              />
            </View>
          );
        }}
        data={users.filter((user) => !user.isDisabled)}
        renderItem={renderItem}
        keyExtractor={(item) => item.email}
        contentContainerStyle={styles.listContent}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={handleDeleteUser} style={styles.option}>
              <Text style={styles.optionText}>Delete User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePromoteToAdmin}
              style={styles.option}
            >
              <Text style={styles.optionText}>{selectedUserAction}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowOptionsModal(false)}
              style={styles.option}
            >
              <Text style={styles.optionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Loader isLoading={loading} />
    </View>
  );
};

export default AdminView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  listContent: {
    paddingBottom: 16
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1
  },
  adminText: {
    fontSize: 14,
    color: "black"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    alignItems: "center"
  },
  option: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center"
  },
  optionText: {
    fontSize: 18,
    color: "black"
  }
});
