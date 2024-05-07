import React, { useState, useEffect, useContext } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const AuthContext = React.createContext();

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      // Configure Google Sign-In options if needed
    });
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      try {
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      }
    });

    return unsubscribe; // Cleanup function to prevent memory leaks
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      // setCurrentUser(null); // Update state after successful signout
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle signout errors (optional)
    }
  };

  const signInWithGoogle = async () => {
    const PLAY_SERVICES = await GoogleSignin.hasPlayServices();
    try {
      // Initiate Google Sign-In and get user info
      const response = await GoogleSignin.signIn();
      const firebaseUid = response.user.id;
      setCurrentUser({ uid: firebaseUid, ...response.user });
      return response;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return { currentUser, signOut, signInWithGoogle };
};

export const AuthProvider = ({ children }) => {
  const authContext = useAuth();
  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
