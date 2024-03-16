import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { setDoc, getFirestore, collection, doc } from 'firebase/firestore';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from './Components/firebase';
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const UserIcon = () => {
  return (
    <View style={styles.userIconContainer}>
      <FontAwesome5 name="user" style={styles.userIcon} />
    </View>
  );
}

export default function SignupScreen({navigation}) {
  // const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [load, setLoad] = useState(false);
  
  const handleRegister = async () => {
    // Set loading state to true when registration starts
    setLoad(true);
  
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Please enter the same password in both fields");
      // Reset loading state before returning
      setLoad(false);
      return;
    }
  
    // Initialize Firebase authentication and Firestore
    const auth = getAuth(app);
    const db = getFirestore(app);
  
    console.log("Email:", email); // Log email for debugging
  
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("New User UID:", user.uid); // Log UID for debugging
  
      // Reference to the 'users' collection
      const userRef = collection(db, "users");
      // Create a document reference using the user's UID
      const userDoc = doc(userRef, user.uid);
      console.log("New:", userDoc);
      // Data to be stored in the Firestore document
      const userData = {
        email: email,
        // You may not want to store the password in plaintext for security reasons.
        // Consider removing the password field or hashing it before storing.
        // password: password, 
      };
  
      // Set data in Firestore document
      await setDoc(userDoc, userData);
  
      console.log('User added to Firestore');
      
      // Navigate to login screen after successful registration
      navigation.navigate('login');
    } catch (error) {
      console.error("Registration Failed:", error);
      Alert.alert("Registration Failed", error.message);
    } finally {
      // Reset loading state regardless of success or failure
      setLoad(false);
    }
  };
  
//   const handleRegister = async () => {
//     setLoad(true);
//     if (password !== confirmPassword) {
//       Alert.alert("Password Mismatch", "Please enter the same password in both fields");
//       return;
//     }

//     const auth = getAuth(app);
//     const db = getFirestore(app);
// console.log(email);
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       // console.warn(user)
//       // console.warn(userCredential)
//       const userRef = collection(db, "users");
//       const userDoc = doc(userRef, user.uid);

//       await setDoc(userDoc, {
//         email: email,
//         password: password,
//       });

//       navigation.navigate('login');
//       setLoad(false);
//       console.log('User added to Firestore');
//     } catch (error) {
//       console.log(error.message);
//       Alert.alert("User registration Failed", error.message);
//       setLoad(false);
//     }
//   };

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
            onChangeText={(text) => setEmail(text)}
          />
         
        </View>

        <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          
        </View>

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
