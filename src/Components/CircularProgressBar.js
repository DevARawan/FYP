import { Circle, G, Svg, Text as SvgText } from "react-native-svg";

export const CircularProgressBar = ({ currentAmount, totalAmount }) => {
  const strokeWidth = 20;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = (currentAmount / totalAmount) * circumference;

  return (
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
    </Svg>
  );
};
