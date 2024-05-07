import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { statusCodes } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useAuthContext } from "../../Hooks/UseAuth";
import { setUser } from "../../Store/reducers/UserSlice";
import { setCurrency } from "../../Store/reducers/currenncyReducer";

const SignUpBusinessLogic = ({ children, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [validationError, setValidationError] = useState(false);
  const { signOut, signInWithGoogle } = useAuthContext();

  const validateEmail = (email, type) => {
    setEmail(email);
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Test the email against the regex
    setIsEmailValid(emailRegex.test(email));
  };
  const validatePassword = (password) => {
    setPassword(password);
    // Regular expressions for password validation
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[$&+,:;=?@#|'<>.^*()%!-]/;
    const minLength = 8;
    // Test the password against the regex
    const isUpperCaseValid = upperCaseRegex.test(password);
    const isLowerCaseValid = lowerCaseRegex.test(password);
    const isNumberValid = numberRegex.test(password);
    const isSymbolValid = symbolRegex.test(password);
    const isLengthValid = password.length >= minLength;
    const isPasswordValid =
      isUpperCaseValid &&
      isLowerCaseValid &&
      isNumberValid &&
      isSymbolValid &&
      isLengthValid;
    setIsPasswordValid(isPasswordValid);
  };
  const handleRegister = async () => {
    setValidationError(true); // Reset validation state

    // Validate email, password, and confirm password
    if (email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
      if (isEmailValid && isPasswordValid) {
        const auth = FIREBASE_AUTH;
        setLoad(true); // Set loading state

        if (password !== confirmPassword) {
          Alert.alert(
            "Password Mismatch",
            "Please enter the same password in both fields"
          );
          setLoad(false); // Reset loading state on error
          return;
        }

        try {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              return userCredential.user;
            }) // Access user object
            .then((user) => {
              sendEmailVerification(user);
            })
            .then((res) => {
              Alert.alert("Email Sent Successful"); // Inform user
            })
            .then(() => {
              signOut();
            })
            .then(() => {
              navigation.navigate("login");
            })
            .catch((error) => {
              console.error("Registration Failed:", error);
              Alert.alert("Registration Failed", error.message);
            })
            .finally(() => {
              setLoad(false); // Reset loading state regardless of success/failure
            });
        } catch (error) {
          console.error("Registration Failed:", error);
          Alert.alert("Registration Failed", error.message);
        } finally {
          setLoad(false); // Ensure loading state is reset even on exceptions
        }
      } else {
        ToastAndroid.show("Invalid Email", ToastAndroid.SHORT); // Inform user of invalid email
      }
    } else {
      ToastAndroid.show("Empty Email or Password", ToastAndroid.SHORT); // Inform user of missing fields
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("user is:", user);
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

  const goBack = () => {
    navigation.navigate("login");
  };
  return children({
    navigation,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    load,
    setLoad,
    isEmailValid,
    setIsEmailValid,
    isPasswordValid,
    setIsPasswordValid,
    validationError,
    setValidationError,
    validateEmail,
    validatePassword,
    handleRegister,
    goBack,
    handleSignInWithGoogle
  });
};
export default SignUpBusinessLogic;
