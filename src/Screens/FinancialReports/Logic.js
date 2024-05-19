import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/UseAuth";

const FinancialReportsBusinessLogic = ({ children, navigation }) => {
  const [achievements, setAchievements] = useState(0);
  const [goals, setGoals] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuthContext();
  const userId = currentUser.uid;
  useEffect(() => {
    const fetchAchievementsAndGoals = async () => {
      try {
        setIsLoading(true);
        const achievementsSnapshot = await firestore()
          .collection("users")
          .doc(userId)
          .collection("achievements")
          .get();
        const goalsSnapshot = await firestore()
          .collection("users")
          .doc(userId)
          .collection("goals")
          .get();
        setAchievements(achievementsSnapshot.size); // Number of achievements
        setGoals(goalsSnapshot.size); // Number of goals
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching achievements and goals:", error);
      }
    };

    fetchAchievementsAndGoals();
  }, []);
  return children({
    navigation,
    achievements,
    setAchievements,
    goals,
    setGoals,
    isLoading,
    setIsLoading,
    currentUser,
    userId
  });
};
export default FinancialReportsBusinessLogic;
