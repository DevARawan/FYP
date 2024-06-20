import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../Hooks/UseAuth";
const LeaderboardBusinessLogic = ({ children, navigation }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Assuming you have access to the current user's ID
  const { currentUser } = useAuthContext();
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        const usersSnapshot = await firestore().collection("users").get();
        const users = usersSnapshot.docs.map((doc) => doc.data());

        const usersWithAchievements = await Promise.all(
          users.map(async (user) => {
            const achievementsSnapshot = await firestore()
              .collection("users")
              .doc(user.user_id)
              .collection("achievements")
              .get();
            const achievements = achievementsSnapshot.docs.map((doc) =>
              doc.data()
            );

            const achievementCount = achievements.length;
            return { ...user, achievementCount };
          })
        );

        usersWithAchievements.sort(
          (a, b) => b.achievementCount - a.achievementCount
        );

        setLeaderboardData(usersWithAchievements);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);
  return children({
    navigation,
    leaderboardData,
    setLeaderboardData,
    isLoading,
    setIsLoading,
    currentUser
  });
};
export default LeaderboardBusinessLogic;
