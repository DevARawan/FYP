import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_APP, FIREBASE_DB } from "../../../firebaseConfig";

const SignUpBusinessLogic = ({children, navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [load, setLoad] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [validationError, setValidationError] = useState(false)

    const validateEmail = (email, type) => {
        setEmail(email)
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Test the email against the regex
        console.log('email valid', emailRegex.test(email))
        setIsEmailValid(emailRegex.test(email))
    }
    const validatePassword = (password) => {
        setPassword(password)
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
        const isPasswordValid = isUpperCaseValid && isLowerCaseValid && isNumberValid && isSymbolValid && isLengthValid;
        setIsPasswordValid(isPasswordValid)
    };
    const handleRegister = async () => {
        setValidationError(true)
        if (email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
        if(isEmailValid){
        const auth = FIREBASE_AUTH
        setLoad(true);
        if (password !== confirmPassword) {
          Alert.alert("Password Mismatch", "Please enter the same password in both fields");
          setLoad(false);
          return;
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const userRef = collection(FIREBASE_DB, "users");
          // Create a document reference using the user's UID
          const userDoc = doc(userRef, user.uid);
          // Data to be stored in the Firestore document
          const userData = {
            email: email,
            user_id:user.uid
          };
          // Set data in Firestore document
          await setDoc(userDoc, userData);
          // Navigate to login screen after successful registration
          navigation.navigate('login');
        } catch (error) {
          console.error("Registration Failed:", error);
          Alert.alert("Registration Failed", error.message);
        } finally {
          // Reset loading state regardless of success or failure
          setLoad(false);
        }
      }else {
        ToastAndroid.show('Invalid Email', ToastAndroid.SHORT);
      }
      }else{
        ToastAndroid.show('Empty Email or Password', ToastAndroid.SHORT);
    }}  
    const goBack = ()=>{
        navigation.navigate('login');
    }
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
}
export default SignUpBusinessLogic;