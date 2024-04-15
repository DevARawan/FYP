import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuthContext } from "../Hooks/UseAuth";
import Loader from "../Utils/Loader";
import { getMedal } from "../Utils/MedalUtils";
const LeaderboardScreen = () => {
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

  const renderUserItem = ({ item, index }) => {
    const isCurrentUser = currentUser && item.user_id === currentUser.uid;
    return (
      <View style={[styles.userRow, isCurrentUser && styles.currentUserRow]}>
        <Text style={styles.rank}>{index + 1}</Text>
        <Text style={styles.userInfo}>{item.email}</Text>
        <View style={styles.achievementContainer}>
          <Text style={styles.medal}>{getMedal(item.achievementCount)}</Text>
        </View>
      </View>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={leaderboardData}
        renderItem={renderUserItem}
        keyExtractor={(item, index) => `${item.userId}_${index}`}
        ItemSeparatorComponent={renderSeparator}
      />
      <Loader isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  leaderboardContainer: {
    flex: 1
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  currentUserRow: {
    // You can change this to whatever highlight color you prefer
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10
  },
  userInfo: {
    fontSize: 16,
    flex: 1
  },
  achievementContainer: {
    alignItems: "flex-end",
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: "lightgray",
    marginVertical: 5
  },
  medal: { color: "red", fontSize: 40 }
});

export default LeaderboardScreen;
