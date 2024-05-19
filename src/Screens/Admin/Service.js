import firestore from "@react-native-firebase/firestore";
import React, { useState, useEffect } from "react";
import { fetchAllUsers } from "../../Utils/FirebaseFunctions";
import auth from "@react-native-firebase/auth";
export const example_email = "exampleemail@yopmail.com";

const AdminService = ({ children, navigation }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setloading] = useState(false);
  const [selectedUserAction, setSelectedUserAction] =
    useState("Promote To Admin");

  const handleOptions = (user) => {
    if (user.isAdmin) {
      setSelectedUserAction("Demote From Admin");
    } else {
      setSelectedUserAction("Promote To Admin");
    }
    setSelectedUser(user);
    setShowOptionsModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.user_id) {
      console.error("Selected user is missing an ID");
      return;
    }

    try {
      setloading(true);
      const userDocRef = firestore()
        .collection("users")
        .doc(selectedUser.user_id);

      // Update the document with isDisabled: true
      await userDocRef.update({ isDisabled: true });

      // Update local user list (if needed)
      const updatedUsers = users.map((u) => {
        if (u.user_id === selectedUser.user_id) {
          return { ...u, isDisabled: true };
        }
        return u;
      });
      setUsers(updatedUsers);
    } catch (error) {
      setloading(false);
      console.error("Error updating user:", error);
    } finally {
      setloading(false);
      setShowOptionsModal(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
      setloading(false);
    };
    fetchData();
  }, []);

  const handlePromoteToAdmin = async () => {
    if (!selectedUser?.user_id) {
      console.error("Selected user is missing an ID");
      return;
    }
    setloading(true);
    try {
      const userDocRef = firestore()
        .collection("users")
        .doc(selectedUser.user_id);
      if (selectedUser.isAdmin) {
        await userDocRef.update({ isAdmin: false });
        const updatedUsers = users.map((u) => {
          if (u.user_id === selectedUser.user_id) {
            return { ...u, isAdmin: false };
          }
          return u;
        });
        setUsers(updatedUsers);
      } else {
        await userDocRef.update({ isAdmin: true });
        const updatedUsers = users.map((u) => {
          if (u.user_id === selectedUser.user_id) {
            return { ...u, isAdmin: true };
          }
          return u;
        });
        setUsers(updatedUsers);
      }

      // Update local user list (if needed)
    } catch (error) {
      console.error("Error updating user:", error);
      setloading(false);
    } finally {
      setShowOptionsModal(false);
      setloading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setShowOptionsModal(false);
    });

    return unsubscribe;
  }, [navigation]);

  return children({
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
  });
};

export default AdminService;
