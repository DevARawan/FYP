import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView, Animated
} from "react-native";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from 'lottie-react-native';

const Settings = () => {
  const navigation = useNavigation();
  const [showGenerateOptions, setShowGenerateOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
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

  const handleLogout = () => {
    AsyncStorage.removeItem("user");
    navigation.navigate("FrontScreen");
  };

  const handleAchievements = () => {
    navigation.navigate("Achievements");
  };

  const handlePolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleGeneral = () => {
    navigation.navigate("CurrencyPreferences");
  };

  const startBlinkingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <LottieView style={{width:200, height:150, alignSelf:'center', marginBottom:50}}
        source={require('../../Animations/settings - 1710606317630.json')} autoPlay loop 
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
              selectedOption === "Goal progress" && styles.selectedOption,
            ]}
            onPress={() => handleOptionSelect("Goal progress")}
          >
            <Text>Goal progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dropdownOption,
              selectedOption === "Achieving goal" && styles.selectedOption,
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
      {showGenerateOptions && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.dropdownOption,
              selectedRow === "Generate Financial Report"
                ? styles.selectedOption
                : null,
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
                : null,
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 13,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  headerIcon: {
    fontSize: 65,
    color: "#666666",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 15,
  },
  link: {
    fontSize: 16,
    color: "#333333",
  },
  rowIcon: {
    fontSize: 22,
    color: "#666666",
  },
  dropdown: {
    backgroundColor: "#f9f9f9",
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  dropdownOption: {
    paddingVertical: 10,
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
    marginBottom: 35,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  selectedOption: {
    backgroundColor: "#d4ebf2",
    width: "100%",
  },
});

export default Settings;
