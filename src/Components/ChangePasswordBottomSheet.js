import { MaterialIcons } from "@expo/vector-icons";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View
} from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { useAuthContext } from "../Hooks/UseAuth";
import Loader from "../Utils/Loader";

const ChangePasswordBottomSheet = ({ setIsBottomSheetVisible }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuthContext();

  useEffect(() => {}, []);

  const updatePasswords = async () => {
    try {
      setIsLoading(true);

      // Get current password from user input (replace with your logic)

      // Validate new password strength (optional)
      if (!validatePassword(newPassword)) {
        throw new Error("New password doesn't meet complexity requirements.");
      }

      // Create credential object for re-authentication
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );
      // Reauthenticate user with current password
      await reauthenticateWithCredential(FIREBASE_AUTH.currentUser, credential);
      await updatePassword(FIREBASE_AUTH.currentUser, newPassword);
      // Update password with new password
      ToastAndroid.show("Password updated successfully!", 1000);
      console.log("Password updated successfully!");
    } catch (error) {
      ToastAndroid.show("Error updating password:" + error, 1000);
      console.error("Error updating password:", error);
      setIsLoading(false);
      // Handle errors appropriately (e.g., invalid password, network issues)
    } finally {
      setIsLoading(false);
      setIsBottomSheetVisible(false); // Close the bottom sheet after updating password
    }
  };

  // Password complexity validation function
  const validatePassword = (password) => {
    const minLength = 8; // Adjust minimum length as needed
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Change Password</Text>
        <MaterialIcons
          name="close"
          size={30}
          onPress={() => setIsBottomSheetVisible(false)}
        />
      </View>
      <View style={styles.form}>
        <TextInput
          value={oldPassword}
          onChangeText={(value) => setOldPassword(value)}
          placeholder="Current Password"
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          value={newPassword}
          onChangeText={(value) => setNewPassword(value)}
          placeholder="New Password"
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          value={confirmPassword}
          onChangeText={(value) => setConfirmPassword(value)}
          placeholder="Confirm New Password"
          style={styles.input}
          secureTextEntry
        />
      </View>
      <Button title="Submit" onPress={updatePasswords} disabled={isLoading} />
      <Loader isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  form: {
    marginBottom: 20
  },
  input: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5
  }
});

export default ChangePasswordBottomSheet;
