import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import { fetchAllUsers } from "../../Utils/FirebaseFunctions";

const AdminService = ({ children, navigation }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [users, setUsers] = useState([]);

  const handleOptions = (user) => {
    setSelectedUser(user);
    setShowOptionsModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.user_id) {
      console.error("Selected user is missing an ID");
      return;
    }

    try {
      const userDocRef = firestore()
        .collection("users")
        .doc(selectedUser.user_id);

      await userDocRef.delete();

      const updatedUsers = users.filter(
        (u) => u.user_id !== selectedUser.user_id
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowOptionsModal(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
    };
    fetchData();
  }, []);

  return children({
    navigation,
    selectedUser,
    setSelectedUser,
    showOptionsModal,
    setShowOptionsModal,
    users,
    setUsers,
    handleOptions,
    handleDeleteUser
  });
};

export default AdminService;
