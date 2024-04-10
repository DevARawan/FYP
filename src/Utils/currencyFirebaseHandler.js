import { useAuthContext } from "../Hooks/UseAuth";
import firestore from "@react-native-firebase/firestore";
export const updateUserCurrency = (currency) => async (dispatch, getState) => {
  const { currentUser } = useAuthContext();
  try {
    const userId = currentUser.uid; // Assuming you have userId in your user state
    if (!userId) throw new Error("User not authenticated.");

    // Update user's currency in Firestore
    const response = await firestore().collection("users").doc(userId).update({
      currency: currency
    });

    return response;
  } catch (error) {
    console.error("Error updating user currency:", error.message);
  }
};
