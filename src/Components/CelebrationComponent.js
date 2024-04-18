import React, { useEffect, useState } from "react";
import { View, Text, Animated, Easing, Dimensions } from "react-native";
import Particles from "react-native-particles";

const CelebrationComponent = ({ onCelebrationEnd }) => {
  const [balloonAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    startBalloonAnimation();
    // Add  other effects here
    return () => {
      //  gic
    };
  }, []);

  const startBalloonAnimation = () => {
    Animated.timing(balloonAnimation, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      onCelebrationEnd(); // Callback to parent component when celebration ends
    });
  };

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={{ flex: 1 }}>
      <Particles
        color={{ r: 255, g: 255, b: 255 }}
        num={200}
        radius={2}
        speed={10}
        style={{
          position: "absolute",
          zIndex: 1,
          width: screenWidth,
          height: screenHeight
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: screenWidth / 2 - 20,
          transform: [
            {
              translateY: balloonAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -screenHeight]
              })
            }
          ]
        }}
      >
        <Text style={{ fontSize: 40 }}>🎈</Text>
      </Animated.View>
    </View>
  );
};

export default CelebrationComponent;
