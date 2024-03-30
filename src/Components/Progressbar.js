import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Text as SvgText, G } from "react-native-svg";

const CircularProgressBar = () => {
  const [progress, setProgress] = useState(100); // Initial progress in seconds
  const radius = 50;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress > 0) {
        setProgress((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  const calculateStrokeOffset = () => {
    const percentage = (progress / 60) * 100;
    return circumference - (circumference * percentage) / 100;
  };

  return (
    <View style={styles.container}>
      <Svg height="200" width="200">
        <G rotation="0" origin="100, 100">
          {/* Gray Circle */}
          <Circle
            r={radius}
            cx="100"
            cy="100"
            stroke="#ddd"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Green Circle (Progress) */}
          <Circle
            r={radius}
            cx="100"
            cy="100"
            stroke="#15AF75"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={calculateStrokeOffset()}
            fill="none"
            strokeLinecap="round"
          />

          {/* Text in the center */}
          <SvgText
            x="100"
            y="100"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#313A68"
            fontFamily="OpenSans_600SemiBold"
          >
            {Math.round((progress / 60) * 100)}%
          </SvgText>
        </G>
      </Svg>
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
