import React from "react";
import { Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const MostCommonWorkoutSummaryCard = ({
  totalWorkoutNumber,
  mostFrequentSplit,
}) => {
  const radius = width * 0.1;
  const strokeWidth = width * 0.02;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const progress = totalWorkoutNumber
    ? Math.min(mostFrequentSplit.maxCount / totalWorkoutNumber, 1)
    : 0;

  console.log(mostFrequentSplit);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View
      style={{
        flex: 3,
        height: "100%",
        borderRadius: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: RFValue(12),
          color: "black",
          marginBottom: height * 0.015,
        }}
      >
        Common
      </Text>
      {mostFrequentSplit.splitname ? (
        <>
          <View
            style={{
              width: radius * 2,
              height: radius * 2,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Svg height={radius * 2} width={radius * 2}>
              <Circle
                stroke="#e6e6e6"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <Circle
                stroke="#2979FF"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                rotation="-90"
                origin={`${radius}, ${radius}`}
              />
            </Svg>

            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: radius * 2,
                height: radius * 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(15),
                  color: "black",
                }}
              >
                {mostFrequentSplit?.splitname}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(10),
                  color: "#666",
                }}
              >
                {mostFrequentSplit?.maxCount} / {totalWorkoutNumber}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text>No records</Text>
      )}
    </View>
  );
};

export default MostCommonWorkoutSummaryCard;
