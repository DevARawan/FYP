import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { useAuthContext } from "../Hooks/UseAuth";
import { Button, TextInput } from "react-native-paper";
import { BottomSheet } from "react-native-elements";

const Settings = () => {
  const navigation = useNavigation();
  const [showGenerateOptions, setShowGenerateOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const user = auth.currentUser;
      // ... (placeholder logic for reauthenticateWithCredential)
      const credential = await reauthenticateWithCredential(user /* ... */);
      await updatePassword(user, newPassword);
      // Show success message
    } catch (error) {
      console.error(error);
      // Show error message based on error code
    }
  };
  const { signOut } = useAuthContext();
  const [blinkAnimation] = useState(new Animated.Value(0));

  const handleProfile = () => {
    navigation.navigate("profile");
  };

  const handleGenerateOptionsToggle = () => {
    setShowGenerateOptions(!showGenerateOptions);
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option === selectedOption ? "" : option);
    startBlinkingAnimation();
    setTimeout(() => {
      setShowNotifications(false); // Close the dropdown after 1 second
    }, 100);
  };

  const handleOption = (option) => {
    setSelectedRow(option === selectedOption ? "" : option);
    startBlinkingAnimation();
    setTimeout(() => {
      setShowGenerateOptions(false); // Close the dropdown after 1 second
    }, 100);
  };

  const handleLogout = async () => {
    await signOut();
    navigation.navigate("FrontScreen");
  };

  const handleAchievements = () => {
    navigation.navigate("Achievements");
  };

  const handlePolicy = () => {
    navigation.navigate("privacy policy");
  };

  const handleGeneral = () => {
    navigation.navigate("CurrencyPreferences");
  };

  const ChangePasswordBottomSheet = () => {
    return (
      <View style={styles.resetContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.title}>Change Password</Text>
          <MaterialIcons
            onPress={() => {
              setIsBottomSheetVisible(false);
            }}
            name="close"
            size={30}
          />
        </View>
        <View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              value={oldPassword}
              onChangeText={(value) => setOldPassword(value)}
              placeholder="Current Password"
              style={styles.textInput}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-plus"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              mask="..."
              placeholder="New Password"
              style={styles.textInput}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check"
              size={24}
              color="black"
              style={styles.icon}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mask="..."
              placeholder="Re-enter New Password"
              style={styles.textInput}
              secureTextEntry
            />
          </View>
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" color="grey" />
        </View>
      </View>
    );
  };
  const startBlinkingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <MaterialIcons name="settings" style={styles.headerIcon} /> */}
        <LottieView
          style={{
            width: 200,
            height: 150,
            alignSelf: "center",
            marginBottom: 50
          }}
          source={require("../../Animation1 - 1710499066508.json")}
          autoPlay
          loop
        />
      </View>
      <TouchableOpacity style={styles.row} onPress={handleProfile}>
        <Text style={styles.link}>My Profile</Text>
        <FontAwesome5
          name="user-circle"
          style={[styles.rowIcon, { color: "#FFA500" }]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={handleNotifications}>
        <Text style={styles.link}>Notification Preferences</Text>
        <MaterialIcons
          name={showNotifications ? "keyboard-arrow-up" : "chevron-right"}
          style={[styles.rowIcon, { color: "black" }]}
        />
      </TouchableOpacity>
      {showNotifications && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.dropdownOption,
              selectedOption === "Goal progress" && styles.selectedOption
            ]}
            onPress={() => handleOptionSelect("Goal progress")}
          >
            <Text>Goal progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dropdownOption,
              selectedOption === "Achieving goal" && styles.selectedOption
            ]}
            onPress={() => handleOptionSelect("Achieving goal")}
          >
            <Text>Achieving goal</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.row}
        onPress={handleGenerateOptionsToggle}
      >
        <Text style={styles.link}>Generate Reports</Text>
        <MaterialIcons
          name={showGenerateOptions ? "keyboard-arrow-up" : "chevron-right"}
          style={[styles.rowIcon, { color: "black" }]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => setIsBottomSheetVisible(true)}
      >
        <Text style={styles.link}>Change Password</Text>
        <MaterialIcons
          name={showGenerateOptions ? "keyboard-arrow-up" : "chevron-right"}
          style={[styles.rowIcon, { color: "black" }]}
        />
      </TouchableOpacity>
      {showGenerateOptions && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.dropdownOption,
              selectedRow === "Generate Financial Report"
                ? styles.selectedOption
                : null
            ]}
            onPress={() => handleOption("Generate Financial Report")}
          >
            <Text>Generate Financial Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dropdownOption,
              selectedRow === "Generate Expense Report"
                ? styles.selectedOption
                : null
            ]}
            onPress={() => handleOption("Generate Expense Report")}
          >
            <Text>Generate Expense Report</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.row} onPress={handleGeneral}>
        <Text style={styles.link}>General settings</Text>
        <FontAwesome
          name="globe"
          style={[styles.rowIcon, { color: "#3498DB" }]}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={handleAchievements}>
        <Text style={styles.link}>Achievements</Text>
        <FontAwesome
          name="trophy"
          style={[styles.rowIcon, { color: "#FFD700" }]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row}>
        <Text style={styles.link}>About us</Text>
        <MaterialIcons
          name="description"
          style={[styles.rowIcon, { color: "#607D8B" }]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={handlePolicy}>
        <Text style={styles.link}>Privacy Policy</Text>
        <FontAwesome5
          name="user-secret"
          style={[styles.rowIcon, { color: "#8E44AD" }]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
        <MaterialIcons
          name="logout"
          style={[styles.logoutIcon, { color: "#ffffff" }]}
        />
      </TouchableOpacity>
      {/* <Button icon="logout" mode="contained" style={styles.logoutButton} onPress={handleLogout}>
      Logout
    </Button> */}
      <BottomSheet isVisible={isBottomSheetVisible}>
        <ChangePasswordBottomSheet />
      </BottomSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 13,
    paddingTop: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10
  },
  headerIcon: {
    fontSize: 65,
    color: "#666666"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 15
  },
  link: {
    fontSize: 16,
    color: "#333333"
  },
  rowIcon: {
    fontSize: 22,
    color: "#666666"
  },
  dropdown: {
    backgroundColor: "#f9f9f9",
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5
  },
  dropdownOption: {
    paddingVertical: 10
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 70,
    marginBottom: 35
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold"
  },
  logoutIcon: {
    fontSize: 20,
    color: "#ffffff"
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  selectedOption: {
    backgroundColor: "#d4ebf2",
    width: "100%"
  },
  resetContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: "100%",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  icon: {
    marginRight: 10
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    paddingBottom: 5
  }
});

export default Settings;
