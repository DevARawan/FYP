import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "@firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getFirestore,
  updateDoc
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { FIREBASE_APP } from "../../../firebaseConfig";
import { useAuthContext } from "../../Hooks/UseAuth";

const ProfileBusinessLogic = ({ children, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showUploadButton, setShowUploadButton] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const { signOut } = useAuthContext();
  const user = useSelector((state) => state.user.user);
  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
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
    navigation.navigate("FrontScreen");
  };

  const handleSaveProfile = async () => {
    const app = FIREBASE_APP;
    const storage = getStorage(app);
    const db = getFirestore(app);
    const timestamp = new Date().getTime();
    const fileExtension = selectedImage.split(".").pop().toLowerCase();
    const fileName = `userProfiles_${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `userProfiles/${fileName}`);
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = doc(collection(db, "users"), userData.id);

      updateDoc(userDocRef, {
        profile_url: downloadURL
      });
      const updated_local_storage = { ...userData, profile_url: downloadURL };
      const updated_userData = JSON.stringify(updated_local_storage);
      AsyncStorage.setItem("user", updated_userData);

      setIsEditMode(false);
      setShowUploadButton(false);
    } catch (error) {
      console.error("Error saving profile:", error);
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
    handleSaveProfile
  });
};
export default ProfileBusinessLogic;
