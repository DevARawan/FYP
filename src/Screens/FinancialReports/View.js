import React from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import Loader from "../../Utils/Loader";

import { StyleSheet } from "react-native";

const FinancialReportsView = ({
  navigation,
  achievements,
  setAchievements,
  goals,
  setGoals,
  isLoading,
  setIsLoading,
  currentUser,
  userId
}) => {
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
export default FinancialReportsView;

const styles = StyleSheet.create({});
