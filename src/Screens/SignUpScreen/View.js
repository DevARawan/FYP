import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const UserIcon = () => {
  return (
    <View style={styles.userIconContainer}>
      <FontAwesome5 name="user" style={styles.userIcon} />
    </View>
  );
}

const SignupView = ({  
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
})  => {
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
export default SignupView

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

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 20,
    position: 'relative', 
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
