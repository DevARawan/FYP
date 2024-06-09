import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { useAuthContext } from "../../Hooks/UseAuth";
import Loader from "../../Utils/Loader";
import { useSelector } from "react-redux";

export const handleDisable = () => {
  const interval = setInterval(() => {
    Alert.alert("");
  }, 400);
  return () => clearInterval(interval);
};

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
              item.user_id == currentUser.uid ? "lightgrey" : "white"
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
            <View style={styles.headerContainer}>
              {user.profile_url ? (
                <Image
                  source={{
                    uri: user.profile_url
                  }}
                  style={styles.profileAvatar}
                />
              ) : (
                <FontAwesome5 name="user" size={80} color="black" />
              )}

              <Text style={styles.profileName}>
                {user.isSuperAdmin ? "Super Admin" : "Admin"}
              </Text>
              <Text style={[styles.profileName, { fontSize: 16 }]}>
                {currentUser.email}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() => {
                    navigation.navigate("AdminReport");
                  }}
                >
                  <Text style={styles.buttonText}>Financial Reports</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() => {
                    console.log(user);
                    navigation.navigate("UserGrowth");
                  }}
                >
                  <Text style={styles.buttonText}>Users Reports</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separator} />
              <Text style={styles.userHeading}>Registered Users</Text>
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
  headerContainer: {
    alignItems: "center",
    padding: 20
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%"
  },
  reportButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20
  },
  userHeading: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 10
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
