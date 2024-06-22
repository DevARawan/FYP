import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import firestore from "@react-native-firebase/firestore";
import Loader from "../../Utils/Loader";

const GoalsChartScreen = () => {
  const [userGoalsData, setUserGoalsData] = useState({
    "1-5": 0,
    "6-10": 0,
    "11-15": 0,
    "16-20": 0,
    "21-25": 0
  });
  const [isloading, setloading] = useState(false);

  useEffect(() => {
    const fetchUserGoalsData = async () => {
      try {
        setloading(true);
        const usersSnapshot = await firestore().collection("users").get();
        const updatedData = { ...userGoalsData };

        for (const userDoc of usersSnapshot.docs) {
          const goalsSnapshot = await userDoc.ref.collection("goals").get();
          const goalsCount = goalsSnapshot.size;
          console.log("goals count:", goalsCount);
          updateUserGoalsData(goalsCount, updatedData);
        }

        setUserGoalsData(updatedData);
        setloading(false);
      } catch (error) {
        setloading(false);
        console.error("Error fetching user goals data:", error);
      }
    };

    const updateUserGoalsData = (goalsCount, updatedData) => {
      if (goalsCount >= 1 && goalsCount <= 5) {
        updatedData["1-5"] += 1;
      } else if (goalsCount >= 6 && goalsCount <= 10) {
        updatedData["6-10"] += 1;
      } else if (goalsCount >= 11 && goalsCount <= 15) {
        updatedData["11-15"] += 1;
      } else if (goalsCount >= 16 && goalsCount <= 20) {
        updatedData["16-20"] += 1;
      } else if (goalsCount >= 21 && goalsCount <= 25) {
        updatedData["21-25"] += 1;
      }
    };

    fetchUserGoalsData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Goals Distribution</Text>
      <BarChart
        data={{
          labels: ["1-5", "6-10", "11-15", "16-20", "21-25"],
          datasets: [
            {
              data: [
                userGoalsData["1-5"],
                userGoalsData["6-10"],
                userGoalsData["11-15"],
                userGoalsData["16-20"],
                userGoalsData["21-25"]
              ]
            }
          ]
        }}
        width={400}
        height={400}
        yAxisSuffix=" users"
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#f8f8f8",
          backgroundGradientTo: "#f8f8f8",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
      />
      <Loader isLoading={isloading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20
  }
});

export default GoalsChartScreen;
