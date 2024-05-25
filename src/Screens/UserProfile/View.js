import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { BottomSheet } from "react-native-elements";
import ChangePasswordBottomSheet from "../../Components/ChangePasswordBottomSheet";
import Loader from "../../Utils/Loader";

const ProfileView = ({
  navigation,
  userData,
  setUserData,
  isEditMode,
  setIsEditMode,
  userImage,
  setUserImage,
  email,
  setEmail,
  password,
  setPassword,
  showUploadButton,
  setShowUploadButton,
  selectedImage,
  setSelectedImage,
  isBottomSheetVisible,
  setIsBottomSheetVisible,
  signOut,
  user,
  toggleBottomSheet,
  handleImagePicker,
  handleManageProfile,
  handleLogout,
  handleSaveProfile,
  isLoading,
  setIsloading
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.profileHeading}>User Profile</Text>
      <View style={styles.header}>
        <View style={styles.userImageOutline}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.userImage} />
          ) : user?.profile_url ? (
            <Image
              source={{ uri: user.profile_url }}
              style={styles.userImage}
            />
          ) : (
            <FontAwesome5 name="user" size={80} color="black" />
          )}
        </View>
        {isEditMode && showUploadButton && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImagePicker}
          >
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color="blue"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            editable={false}
          />
        </View>
        {isEditMode ? (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={toggleBottomSheet}
          >
            <Text style={styles.logoutButtonText}>Change Password</Text>
            <MaterialIcons
              name="lock"
              style={[styles.logoutIcon, { color: "#ffffff" }]}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.inputContainer}>
            <FontAwesome5
              name="key"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="change your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isEditMode}
              editable={isEditMode}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.manageProfileButton}
        onPress={isEditMode ? handleSaveProfile : handleManageProfile}
      >
        <Text style={styles.manageProfileButtonText}>
          {isEditMode ? "Save Profile" : "Manage Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
        <MaterialIcons
          name="logout"
          style={[styles.logoutIcon, { color: "#ffffff" }]}
        />
      </TouchableOpacity>
      <BottomSheet isVisible={isBottomSheetVisible}>
        <ChangePasswordBottomSheet
          setIsBottomSheetVisible={setIsBottomSheetVisible}
        />
      </BottomSheet>
      <Loader isLoading={isLoading} />
    </View>
  );
};
export default ProfileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 50
  },
  profileHeading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  header: {
    alignItems: "center",
    marginBottom: 20
  },
  userImageOutline: {
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },
  userImage: {
    width: "100%",
    height: "100%",
    borderRadius: 80
  },
  uploadButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16
  },
  profileInfo: {
    marginBottom: 20
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
    borderBottomWidth: 1,
    borderBottomColor: "grey"
  },
  icon: {
    marginRight: 10
  },
  logoutIcon: {
    fontSize: 20,
    color: "#ffffff"
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "black"
  },
  manageProfileButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20
  },
  manageProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 17,
    marginBottom: 12
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});
