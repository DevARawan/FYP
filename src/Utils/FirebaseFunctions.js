import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { Alert, ToastAndroid } from "react-native";

export async function fetchAllUsers() {
  try {
    const usersCollection = firestore().collection("users");
    const querySnapshot = await usersCollection
      .where("isDisabled", "==", false)
      .get();
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return empty array in case of error
  }
}

export const handlePending = () => {
  const interval = setInterval(() => {
    Alert.alert("");
  }, 400);
  return () => clearInterval(interval);
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const user = auth().currentUser;

    // Reauthenticate the user with their current password for security
    const credential = auth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    );
    await user.reauthenticateWithCredential(credential);

    // Update the user's password
    await user.updatePassword(newPassword);
    ToastAndroid.show("Password changed successfully!", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Error changing password:", error);
    // Handle errors (e.g., invalid password, network issues)
    throw error; // Re-throw the error for handling in the calling component
  }
};

export default changePassword;
