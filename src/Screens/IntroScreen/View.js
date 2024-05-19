import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import myColor from "../../Components/Color";

const IntroView = ({ navigation, handleLogin, handleSignup }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../Images/myimg1.jpg")}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <View style={styles.bodyContainer}>
        <Text style={styles.titleText}>Welcome to</Text>
        <Text style={styles.titleText}>BudgetSupervisor</Text>
        <Text style={styles.descriptionText}>
          Take control of your finances and achieve your financial goals with
          ease.
        </Text>

        <View style={styles.iconContainer}>
          <Image
            source={require("../../Images/budget.png")}
            style={styles.icon}
          />
          <Image
            source={require("../../Images/money.png")}
            style={styles.icon}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};
export default IntroView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  headerImage: {
    width: "100%",
    height: "37%"
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    alignItems: "center"
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Roboto"
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    color: "#302f2f",
    fontFamily: "Nunito"
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10
  },
  loginButton: {
    backgroundColor: myColor.bgcolor,
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 10
  },
  signupButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Roboto-Bold"
  }
});
