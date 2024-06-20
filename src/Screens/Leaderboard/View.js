import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Loader from "../../Utils/Loader";
import { getMedal } from "../../Utils/MedalUtils";

const LeaderboardView = ({
  navigation,
  leaderboardData,
  setLeaderboardData,
  isLoading,
  setIsLoading,
  currentUser
}) => {
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
export default LeaderboardView;

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
