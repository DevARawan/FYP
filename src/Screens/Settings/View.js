import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button
} from "react-native";
import LottieView from "lottie-react-native";
import firestore from "@react-native-firebase/firestore";
import Loader from "../../Utils/Loader";
import { useAuthContext } from "../../Hooks/UseAuth";
import ReviewModal from "../../Components/ReviewModel";

const SettingsView = ({
  navigation,
  showGenerateOptions,
  setShowGenerateOptions,
  showNotifications,
  setShowNotifications,
  selectedOption,
  setSelectedOption,
  selectedRow,
  setSelectedRow,
  signOut,
  blinkAnimation,
  user,
  handleProfile,
  handleGenerateOptionsToggle,
  handleNotifications,
  handleOptionSelect,
  handleOption,
  handleLogout,
  handleAchievements,
  handlePolicy,
  handleGeneral,
  startBlinkingAnimation
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuthContext();
  const submitReview = async () => {
    try {
      setIsLoading(true);
      const reviewCollection = firestore().collection("reviews"); // Change here

      const reviewCollectionRef = reviewCollection.doc();

      await reviewCollectionRef.set({
        review: reviewText,
        rating: 0,
        email: currentUser.email
      });

      setReviewText("");

      setModalVisible(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <LottieView
          style={{
            width: 200,
            height: 150,
            alignSelf: "center",
            marginBottom: 50
          }}
          source={require("../../../Animation1 - 1710499066508.json")}
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

      {showGenerateOptions && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={[
              styles.dropdownOption,
              selectedRow === "Generate Financial Report"
                ? styles.selectedOption
                : null
            ]}
            onPress={() => navigation.navigate("FinancialReport")}
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
            onPress={() => navigation.navigate("ExpensesReport")}
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
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("Loans");
        }}
      >
        <Text style={styles.link}>Loan</Text>

        <Ionicons
          name="md-cash"
          size={24}
          color="black"
          style={styles.rowIcon}
        />
      </TouchableOpacity>
      {user && user.isAdmin ? (
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            navigation.navigate("Admin");
          }}
        >
          <Text style={styles.link}>Admin</Text>
          <FontAwesome5
            name="user-shield"
            style={[styles.rowIcon, { color: "#8E44AD" }]}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          if (!user.isAdmin) {
            // setModalVisible(true);
            navigation.navigate("Reviews");
          } else {
            // navigation.navigate("Reviews");
            setModalVisible(true);
          }
        }}
      >
        <Text style={styles.link}>Review</Text>
        <FontAwesome5
          name="user-shield"
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
      <ReviewModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        reviewText={reviewText}
        setReviewText={setReviewText}
        submitReview={submitReview}
      />
      <Loader isLoading={isLoading} />
    </ScrollView>
  );
};
export default SettingsView;

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
