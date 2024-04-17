import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import firestore from "@react-native-firebase/firestore";
import { useAuthContext } from "../Hooks/UseAuth";
import Loader from "../Utils/Loader";

const FinancialReport = () => {
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PieChart
        data={[
          {
            name: "Achievements",
            count: achievements,
            color: "#FF5733",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
          },
          {
            name: "Goals",
            count: goals,
            color: "#FFC300",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
          }
        ]}
        width={300}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#1E2923",
          backgroundGradientTo: "#08130D",
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#FF5733",
              marginRight: 5
            }}
          />
          <Text>Achievements: {achievements}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#FFC300",
              marginRight: 5
            }}
          />
          <Text>Goals: {goals}</Text>
        </View>
      </View>
      <Loader isLoading={isLoading} />
    </View>
  );
};

export default FinancialReport;
