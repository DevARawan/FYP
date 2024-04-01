import React, { useState, useEffect, useContext } from 'react';
import * as firebaseAuth from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig'; // Assuming your Firebase config is in firebaseConfig

const AuthContext = React.createContext();

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // Cleanup function to prevent memory leaks
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseAuth.signOut(FIREBASE_AUTH);
      setCurrentUser(null); // Update state after successful signout
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle signout errors (optional)
    }
  };

  return { currentUser, signOut };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
