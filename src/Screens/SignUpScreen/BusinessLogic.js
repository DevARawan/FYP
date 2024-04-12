import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { useAuthContext } from "../../Hooks/UseAuth";

const SignUpBusinessLogic = ({ children, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [validationError, setValidationError] = useState(false);
  const { signOut } = useAuthContext();
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
      if (isEmailValid) {
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
    goBack
  });
};
export default SignUpBusinessLogic;
