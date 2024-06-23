import AsyncStorage from "@react-native-async-storage/async-storage";

// Key for storing the notification setting
const NOTIFICATION_ENABLED_KEY = "NOTIFICATION_ENABLED";

// Function to set the notification setting
export const setNotificationEnabled = async (enabled) => {
  try {
    await AsyncStorage.setItem(
      NOTIFICATION_ENABLED_KEY,
      JSON.stringify(enabled)
    );
  } catch (error) {
    console.error("Error saving notification setting:", error);
  }
};

// Function to get the notification setting
export const getNotificationEnabled = async () => {
  try {
    const value = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    return value !== null ? JSON.parse(value) : true; // Default to true if no value is set
  } catch (error) {
    console.error("Error retrieving notification setting:", error);
    return true; // Default to true if there is an error
  }
};
