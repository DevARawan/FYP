import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

const UserIcon = () => {
  return (
    <View style={styles.userIconContainer}>
      <FontAwesome5 name="user" style={styles.userIcon} />
    </View>
  );
}

export default function SignupScreen({navigation}) {
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
    return emailRegex.test(email);
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
      console.log("userData is", userData)
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

  return (
    <View style={styles.container}>
      <UserIcon />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create an Account</Text>

        <View style={styles.inputContainer}>
        <FontAwesome5 name="envelope" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => validateEmail(text)}
          />
         
         
        </View>
        {!isEmailValid && validationError &&    <Text style={{color:'red', alignSelf:'flex-end', marginBottom:10 , width:'50%'}}>Please Enter a valid email</Text>}

        <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => validatePassword(text)}
          />    
        </View>
        {!isPasswordValid && validationError &&    
           <Text style={{color:'red', alignSelf:'flex-end', marginBottom:10, width:'80%'}}>Password needs 8+ characters, a number, symbol, and uppercase letter</Text>}
        <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          
        </View>
        {password != confirmPassword && validationError &&    
           <Text style={{color:'red', alignSelf:'flex-end', marginBottom:10, }}>Passwords do not match</Text>}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          {load ? <ActivityIndicator size="small" color="white" /> :
            <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <View style={styles.google}>
          <TouchableOpacity>
            <Text style={styles.buttonText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.back} onPress={goBack}>
          <Text style={{ fontSize: 15, color: 'blue' }}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconContainer: {
    backgroundColor: '#5fa9c7',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15, marginTop:'10%',
  },
  userIcon: {
    fontSize: 60,
    color: 'white',
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: 'black',
  },
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   borderBottomWidth: 1,
  //   borderBottomColor: 'lightgray',
  //   marginBottom: 20,
  // },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items evenly in the container
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 20,
    position: 'relative', // Ensure the container is positioned relatively for absolute positioning of icons
  },
  registerButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20, width:110,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  back: {
    marginTop: 15,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
    color: 'gray',
  },
  google: {
    width: '70%',
    height: 45,
    borderRadius: 30,
    backgroundColor: 'blue',
    marginTop: 30, marginBottom:20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
