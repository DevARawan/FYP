import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { statusCodes } from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import { useAuthContext } from "../../Hooks/UseAuth";
import { setUser } from "../../Store/reducers/UserSlice";
import { setCurrency } from "../../Store/reducers/currenncyReducer";
import { example_email } from "../Admin/Service";
import { handleDisable } from "../Admin/View";
import { useToast } from "react-native-toast-notifications";

const LoginBusinessLogic = ({ children, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isForgotPasswordEmailValid, setIsForgotPasswordEmailValid] =
    useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [validationError, setValidationError] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signOut } = useAuthContext();
  const dispatch = useDispatch();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const { signInWithGoogle } = useAuthContext();
  const handleLogin = async () => {
    setValidationError(true);
    if (email.length > 0 && password.length > 0) {
      if (isEmailValid) {
        setLoad(true);
        try {
          const userInfo = await auth().signInWithEmailAndPassword(
            email,
            password
          );

          if (userInfo.user.emailVerified) {
            try {
              const usersCollection = firestore().collection("users");
              const userDocRef = usersCollection.doc(userInfo.user.uid);
              const userDocSnapshot = await userDocRef.get();
              if (userDocSnapshot.exists) {
                const userData = userDocSnapshot.data();
                if (userData.isDisabled) {
                  Alert.alert(
                    "Account Disabled",
                    "Your account has been disabled. Please contact support for assistance."
                  );
                  auth().signOut();
                } else {
                  navigation.replace("main");

                  if (userData.currency) {
                    dispatch(setCurrency(userData.currency));
                  } else {
                    Alert.alert(
                      "No Currency is currently selected by User",
                      "Go to general settings and select current currency"
                    );
                  }
                }
              } else {
                try {
                  const userData = {
                    email: userInfo.user.email,
                    user_id: userInfo.user.uid,
                    isSuperAdmin: false,
                    isAdmin: false,
                    isDisabled: false
                    // Add any additional user information you want to store
                  };
                  dispatch(setUser(userData));
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
            auth().signOut();
          }
          setLoad(false);
        } catch (error) {
          console.error(error.code);
          if (error.code == "auth/invalid-credential") {
            toast.show(`Invalid Credentials`, {
              type: "danger",
              placement: "top",
              offset: 30,
              animationType: "zoom-in",
              duration: 3500
            });
          }
          setLoad(false);
        }
      } else {
        ToastAndroid.show("Invalid Email", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("Empty Email or Password", ToastAndroid.SHORT);
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = firestore().collection("users");
      const snapshot = await usersRef.get();
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("usersData", usersData);
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const found = users.filter((user) => user.email == example_email);
    if (found.length > 0) {
      handleDisable();
    }
  }, [users]);

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
      const user = await signInWithGoogle();
      const userInfo = user.currentuser;
      try {
        const usersCollection = firestore().collection("users");
        const userDocRef = usersCollection.doc(userInfo.user.id);

        const userDocSnapshot = await userDocRef.get();

        if (userDocSnapshot.exists) {
          const userData = userDocSnapshot.data();
          if (userData.isDisabled) {
            Alert.alert(
              "Account Disabled",
              "Your account has been disabled. Please contact support for assistance."
            );
            auth().signOut();
          } else {
            navigation.replace("main");

            if (userData.currency) {
              dispatch(setCurrency(userData.currency));
            } else {
              Alert.alert(
                "No Currency is currently selected by User",
                "Go to general settings and select current currency"
              );
            }
          }
        } else {
          try {
            const userData = {
              email: userInfo.user.email,
              user_id: userInfo.user.id,
              isSuperAdmin: false,
              isAdmin: false,
              isDisabled: false
              // Add any additional user information you want to store
            };

            console.log("data to be stored:", userData);
            dispatch(setUser(userData));
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
  return children({
    navigation,
    email,
    setEmail,
    password,
    setPassword,
    load,
    setLoad,
    modalVisible,
    setModalVisible,
    isForgotPasswordEmailValid,
    setIsForgotPasswordEmailValid,
    isEmailValid,
    setIsEmailValid,
    validationError,
    setValidationError,
    forgotPasswordEmail,
    setForgotPasswordEmail,
    passwordVisible,
    setPasswordVisible,
    signOut,
    dispatch,
    signInWithGoogle,
    handleLogin,
    handleRegister,
    handleforget,
    handleSignInWithGoogle,
    validateEmail,
    validateForgotPasswordEmail,
    handleForgotPasswordClick
  });
};
export default LoginBusinessLogic;
