import React, { useState, useEffect } from "react";
import { ToastAndroid, View } from "react-native";
import { Circle, Svg, Text as SvgText } from "react-native-svg";
import { useToast } from "react-native-toast-notifications";

export const CircularProgressBar = ({ currentAmount, totalAmount }) => {
  const toast = useToast();
  const [remainingAmount, setRemainingAmount] = useState(
    totalAmount - currentAmount
  );
  const strokeWidth = 27;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = (currentAmount / totalAmount) * circumference;

  useEffect(() => {
    const remaining = totalAmount - currentAmount;
    setRemainingAmount(remaining > 0 ? remaining : 0);

    // Check if progress is reaching 90%
    if (currentAmount > 0 && totalAmount > 0) {
      const percentComplete = (currentAmount / totalAmount) * 100;
      if (percentComplete >= 90 && percentComplete < 100) {
        toast.show(
          `You need $${remainingAmount} to complete your current goal.`,
          {
            type: "success",
            placement: "top",
            offset: 30,
            animationType: "slide-in "
          }
        );
      }
    }
  }, [currentAmount, totalAmount]);

  return (
    <View>
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <Circle
          stroke="#3498db"
          fill="none"
          strokeWidth={strokeWidth}
          strokeOpacity={0.2}
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
        />
        <Circle
          stroke="#3498db"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${progress},${circumference}`}
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
        />
        <SvgText
          fontSize="20"
          x="50%"
          y="50%"
          textAnchor="middle"
          fill="#3498db"
          dy=".3em"
        >
          {currentAmount > 0 && totalAmount > 0
            ? `${
                ((currentAmount / totalAmount) * 100).toFixed(2) > 100
                  ? "100.00%"
                  : ((currentAmount / totalAmount) * 100).toFixed(2)
              }%`
            : 0}
        </SvgText>
        <SvgText
          fontSize="16"
          x="50%"
          y="60%"
          textAnchor="middle"
          fill="#3498db"
          dy=".3em"
        ></SvgText>
      </Svg>
    </View>
  );
};
