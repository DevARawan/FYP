import React, { useState, useEffect, useContext } from "react";
import auth from "@react-native-firebase/auth";

const AuthContext = React.createContext();

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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
      // setCurrentUser(null); // Update state after successful signout
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle signout errors (optional)
    }
  };

  return { currentUser, signOut };
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
