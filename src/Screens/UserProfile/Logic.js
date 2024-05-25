import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../../Hooks/UseAuth";
import { Alert } from "react-native";
import { updateUser } from "../../Store/reducers/UserSlice";

const ProfileBusinessLogic = ({ children, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showUploadButton, setShowUploadButton] = useState(false);
  const { currentUser } = useAuthContext();
  const [isLoading, setIsloading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const { signOut } = useAuthContext();

  const user = useSelector((state) => state.user.user);
  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };
  const dispatch = useDispatch();
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let storedUserData = user;
        if (storedUserData) {
          setUserData(storedUserData);
          setEmail(storedUserData.email);
          setPassword(storedUserData.password);
        }
      } catch (error) {
        console.error("Error fetching user data 3:", error);
      }
    };
    fetchData();
  }, []);

  const handleManageProfile = () => {
    setIsEditMode(!isEditMode);
    setShowUploadButton(!isEditMode);
  };

  const handleLogout = () => {
    signOut();
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("hasGivenReviews");
    navigation.navigate("FrontScreen");
  };

  const handleSaveProfile = async (imageUri) => {
    try {
      setIsloading(true);
      // Generate a unique filename based on the current timestamp
      const timestamp = new Date().getTime();
      const fileExtension = selectedImage.split(".").pop();
      const fileName = `userProfiles_${timestamp}.${fileExtension}`;
      const storageRef = storage().ref(`userProfiles/${fileName}`);
      // Convert the image URI to a blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      // Upload the blob to Firebase Storage
      await storageRef.put(blob);
      // Get the download URL
      const downloadURL = await storageRef.getDownloadURL();
      // Log or use the download URL
      console.log("File available at:", downloadURL);
      const userDocRef = firestore().collection("users").doc(currentUser.uid);
      await userDocRef.update({
        profile_url: downloadURL
      });
      const newUserData = {
        profile_url: downloadURL
      };
      dispatch(updateUser(newUserData));
      console.log("success File available at:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsloading(false);
    }
  };

  return children({
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
  });
};
export default ProfileBusinessLogic;
