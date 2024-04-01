import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import * as firebaseAuth from "firebase/auth";

export async function fetchAllUsers() {
  try {
    const usersCollection = collection(FIREBASE_DB, "users"); // Replace 'users' with your collection name
    const querySnapshot = await getDocs(usersCollection);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return empty array in case of error
  }
}

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const user = firebaseAuth.currentUser;

    // Reauthenticate the user with their current password for security
    const credential = firebaseAuth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    );
    await user.reauthenticateWithCredential(credential);

    // Update the user's password
    await user.updatePassword(newPassword);
    console.log("Password changed successfully!");
  } catch (error) {
    console.error("Error changing password:", error);
    // Handle errors (e.g., invalid password, network issues)
    throw error; // Re-throw the error for handling in the calling component
  }
};

export default changePassword;
