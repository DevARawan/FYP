import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { firebase } from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const userId = "N8S2toD244XhjY78jIq3ty8Bv2J3"; // Replace with actual user ID
      try {
        const querySnapshot = await firestore()
          .collection(`users/${userId}/achievements`)
          .get();
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievements();
  }, []);

  const renderAchievementItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.goalName}>{item.goalName}</Text>
      <Text style={styles.description}>{item.goalDescription}</Text>
      <Text>Total Amount: {item.totalAmount}</Text>
      <Text>Due Date: {item.dueDate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenHeading}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderAchievementItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 50,
    paddingHorizontal: 10
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 4
  },
  goalName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  description: {
    marginBottom: 10
  },
  flatListContent: {
    paddingBottom: 20
  }
});

export default Achievements;
