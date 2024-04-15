import { FontAwesome5 } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import auth from "@react-native-firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import { useDispatch } from "react-redux";

import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import myColor from "../Components/Color";

import { useAuthContext } from "../Hooks/UseAuth";
import { setCurrency } from "../Store/reducers/currenncyReducer";

const UserIcon = () => {
  return (
    <View style={styles.userIconContainer}>
      <FontAwesome5 name="user" style={styles.userIcon} />
    </View>
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isForgotPasswordEmailValid, setIsForgotPasswordEmailValid] =
    useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [validationError, setValidationError] = useState(false);
  // validation error is used to trigger if or not to show validation error behind text field
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const { signOut } = useAuthContext();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    setValidationError(true);
    if (email.length > 0 && password.length > 0) {
      if (isEmailValid) {
        setLoad(true);
        try {
          const userInfo = await signInWithEmailAndPassword(
            FIREBASE_AUTH,
            email,
            password
          );

          if (userInfo.user.emailVerified) {
            try {
              const usersCollection = firestore().collection("users");
              const userDocRef = usersCollection.doc(userInfo.user.uid);

              const userDocSnapshot = await userDocRef.get();
              // const userDocSnapshot = await getDocs(userDocRef);

              if (userDocSnapshot.exists) {
                navigation.replace("main");
                if (userDocSnapshot.data().currency) {
                  dispatch(setCurrency(userDocSnapshot.data().currency));
                } else {
                  Alert.alert(
                    "No Currency is currenctly selected by User. Go to general settings and select current currency"
                  );
                }
              } else {
                try {
                  const userData = {
                    email: userInfo.user.email,
                    user_id: userInfo.user.uid
                    // Add any additional user information you want to store
                  };
                  // Set the document data in Firestore
                  await userDocRef.set(userData);
                  navigation.replace("main");
                } catch (error) {
                  console.error("Error storing user information:", error);
                }
              }
            } catch (error) {
              console.error(error);
            }
          } else {
            Alert.alert(
              "Email Not Verified",
              "Check your email and verify to proceed logging in "
            );

            signOut();
          }
          setLoad(false);
        } catch (error) {
          console.error(error);
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          setLoad(false);
        }
      } else {
        ToastAndroid.show("Invalid Email", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("Empty Email or Password", ToastAndroid.SHORT);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Signup");
  };

  const handleforget = async () => {
    if (forgotPasswordEmail.length > 0 && isForgotPasswordEmailValid) {
      try {
        setLoad(true);
        await auth().sendPasswordResetEmail(forgotPasswordEmail);
        Alert.alert(
          "Password Reset Email Sent",
          "Check your email to reset your password."
        );
        setLoad(false);
      } catch (error) {
        setLoad(false);
        Alert.alert("Password Reset Failed", error.message);
      }
    } else {
      ToastAndroid.show("Invalid or Empty Email", ToastAndroid.SHORT);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const PLAY_SERVICES = await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const userCollection = firestore().collection("users");
      const userDoc = doc(userCollection, userInfo.user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const user = userSnapshot.data();
        const userData = {
          id: userInfo.user.uid,
          ...user
        };
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        setLoad(false);
        navigation.navigate("main");
      } else {
        setLoad(false);
      }
    } catch (error) {
      console.log("Google Sign In Error:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const validateEmail = (email, type) => {
    setEmail(email);
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Test the email against the regex
    setIsEmailValid(emailRegex.test(email));
    return emailRegex.test(email);
  };
  const validateForgotPasswordEmail = (email, type) => {
    setForgotPasswordEmail(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsForgotPasswordEmailValid(emailRegex.test(email));
    return emailRegex.test(email);
  };

  const handleForgotPasswordClick = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <View style={styles.container}>
      <UserIcon />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => validateEmail(text)}
          />
          <FontAwesome5 name="envelope" style={styles.icon} />
        </View>
        {!isEmailValid && validationError && (
          <Text
            style={{ color: "red", alignSelf: "flex-end", marginBottom: 10 }}
          >
            Please Enter a valid email
          </Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { marginBottom: 5 }]}
            placeholder="Enter password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={handleForgotPasswordClick}
          >
            <FontAwesome5 name={passwordVisible ? "eye-slash" : "eye"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          {load ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.google}>
          <TouchableOpacity onPress={handleSignInWithGoogle}>
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
        </View>

        <Pressable
          style={{ marginTop: 0 }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.forgotPasswordText}>Forget Password</Text>
        </Pressable>

        <TouchableOpacity onPress={handleRegister} style={{ marginTop: 16 }}>
          <Text style={styles.redirectText}>Register here</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={forgotPasswordEmail}
                onChangeText={(text) => validateForgotPasswordEmail(text)}
              />
              {!isForgotPasswordEmailValid && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 10,
                    alignSelf: "center",
                    marginBottom: 30
                  }}
                >
                  Please Enter a valid email
                </Text>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "50%"
                }}
              >
                {load ? (
                  <ActivityIndicator color={"blue"} />
                ) : (
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={handleforget}
                  >
                    <Text style={styles.textStyle}> Submit</Text>
                  </Pressable>
                )}

                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center"
  },
  userIconContainer: {
    backgroundColor: "#5fa9c7",
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    marginTop: "10%"
  },
  userIcon: {
    fontSize: 60,
    color: "white"
  },
  formContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginTop: 60,
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: "black"
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 20
  },
  loginButton: {
    backgroundColor: myColor.bgcolor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    width: 110
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  forgotPasswordText: {
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline"
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
    color: "gray"
  },
  redirectText: {
    textDecorationLine: "underline",
    color: "blue"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: "100%"
  },
  modalView: {
    margin: 20,
    width: "90%",
    backgroundColor: "lightgrey",
    borderRadius: 20,
    padding: 30,
    height: 170, // Updated height property
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 50
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF"
  },
  buttonClose: {
    backgroundColor: "#2196F3"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  google: {
    width: "70%",
    height: 45,
    borderRadius: 30,
    backgroundColor: myColor.bgcolor,
    marginTop: 30,
    marginBottom: 20,
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  }
});
