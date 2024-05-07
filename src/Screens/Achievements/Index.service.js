import { useEffect, useState } from "react";
import { Alert, Animated, Linking } from "react-native";
import { useAuthContext } from "../../Hooks/UseAuth";
import firestore from "@react-native-firebase/firestore";

const AchievementsService = ({ children, navigation }) => {
  const [shareDialogVisible, setShareDialogVisible] = useState(false);
  const [starsAnimation] = useState(new Animated.Value(0));
  const [achievements, setAchievements] = useState([]);
  const { currentUser } = useAuthContext();

  useEffect(() => {
    const fetchAchievements = async () => {
      const userId = currentUser.uid; // Replace with actual user ID
      try {
        const querySnapshot = await firestore()
          .collection(`users/${userId}/achievements`)
          .get();
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("achievements:", achievements);
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievements();
  }, []);
  useEffect(() => {
    Animated.loop(
      Animated.timing(starsAnimation, {
        toValue: 1,
        duration: 20000, // Adjust duration as needed
        useNativeDriver: true
      })
    ).start();
  }, []);

  const shareAchievement = (platform, item) => {
    // Logic to open respective platform for sharing
    switch (platform) {
      case "Facebook":
        // Open Facebook sharing screen (placeholder)
        openFacebook(item.goalName, item.goalDescription);
        break;
      case "Twitter":
        // Open Twitter sharing screen (placeholder)
        openTwitter(item.goalName, item.goalDescription);
        break;
      case "Email":
        // Open email app with a prefilled message (placeholder)
        openEmail(item.goalName, item.goalDescription);
        break;
      default:
        break;
    }
    setShareDialogVisible(false); // Close the share dialog after handling
  };

  const openFacebook = () => {
    // Placeholder for opening Facebook sharing screen
    // You can integrate with Facebook SDK or use deep linking if available
    Alert.alert("Opening Facebook for sharing...");
  };

  const openTwitter = () => {
    // Placeholder for opening Twitter sharing screen
    // You can integrate with Twitter SDK or use deep linking if available
    Alert.alert("Opening Twitter for sharing...");
  };

  const openEmail = () => {
    // Placeholder for opening email app with a prefilled message
    // You can use the `Linking` API to open email apps
    Linking.openURL(
      "mailto:?subject=Check%20out%20my%20achievement&body=I%20have%20achieved%20something%20great!"
    );
  };

  return children({
    navigation,
    shareDialogVisible,
    setShareDialogVisible,
    achievements,
    shareAchievement
  });
};
export default AchievementsService;
