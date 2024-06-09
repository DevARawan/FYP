import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import firestore from "@react-native-firebase/firestore";

export default function UserGrowthReport() {
  const [userData, setUserData] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await firestore().collection("users").get();
        const users = usersSnapshot.docs.map((doc) => doc.data());

        // Process data to get user count by month, excluding users without a registeredAt timestamp
        const userCountsByMonth = {};
        users.forEach((user) => {
          if (user.registeredAt) {
            const registeredAt = new Date(user.registeredAt);
            const month = registeredAt.toLocaleString("default", {
              month: "short",
              year: "numeric"
            });
            userCountsByMonth[month] = (userCountsByMonth[month] || 0) + 1;
          }
        });

        // Convert processed data to chart data
        const labels = Object.keys(userCountsByMonth);
        const data = Object.values(userCountsByMonth);

        setUserData({ labels, data });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const chartData = {
    labels: userData.labels,
    datasets: [
      {
        data: userData.data,
        strokeWidth: 2 // optional
      }
    ]
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Growth Report</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 16} // from react-native
        height={220}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  }
});

const chartConfig = {
  backgroundGradientFrom: "#f3f3f3",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(34, 139, 230, ${opacity})`, // Light blue color for the line
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
  fillShadowGradientFrom: "#ffa726",
  fillShadowGradientTo: "#ff7043",
  fillShadowGradientOpacity: 1,
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  }
};
