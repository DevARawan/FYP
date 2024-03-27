import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { FIREBASE_DB } from "../../../firebaseConfig";
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
    // Check if selectedUser has an ID
    if (!selectedUser?.user_id) {
      console.error("Selected user is missing an ID");
      return;
    }

    try {
      // Create a reference to the user document
      const userDocRef = doc(FIREBASE_DB, "users", selectedUser.user_id);

      // Delete the document
      await deleteDoc(userDocRef);

      // Update local state (optional, data might already be outdated)
      const updatedUsers = users.filter(
        (u) => u.user_id !== selectedUser.user_id
      );
      setUsers(updatedUsers);

      console.log("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setShowOptionsModal(false); // Close the modal regardless of success or failure
    }
  };
  React.useEffect(() => {
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
    handleDeleteUser,
  });
};
export default AdminService;
