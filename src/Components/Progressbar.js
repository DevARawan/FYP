import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Text as SvgText, G } from "react-native-svg";
import ProgressCircle from "react-native-progress-circle";
const CircularProgressBar = ({
  currentGoal,
  savingIncome,
  nextGoal,
  ForwardToAchieveHandler,
  celebrationHandler
}) => {
  const [progress, setProgress] = useState(0); // Initial progress in seconds
  const radius = 50;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (progress > 0) {
  //       setProgress((prev) => prev - 1);
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [progress]);

  useEffect(() => {
    if (savingIncome >= currentGoal?.totalAmount) {
      setProgress(100);
      nextGoal(currentGoal, setProgress);
      ForwardToAchieveHandler(currentGoal);
      celebrationHandler(true);
    } else if (savingIncome < currentGoal?.totalAmount) {
      let progressValue = (savingIncome / currentGoal?.totalAmount) * 100;
      setProgress(progressValue);
    }
  }, [currentGoal, savingIncome]);

  const calculateStrokeOffset = () => {
    const percentage = (progress / 60) * 100;
    return circumference - (circumference * percentage) / 100;
  };

  return (
    <View style={styles.container}>
      <ProgressCircle
        percent={progress}
        radius={50}
        borderWidth={8}
        color="#3399FF"
        shadowColor="#999"
        bgColor="#fff"
      >
        <Text style={{ fontSize: 18 }}>{`${progress.toFixed(1)}%`}</Text>
      </ProgressCircle>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Use whatever width you prefer
    height: 200 // Adjust height as needed
  }
});

export default CircularProgressBar;
