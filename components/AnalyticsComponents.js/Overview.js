import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { splitsCounterToPieData } from "../../utils/analyticsUtils";
import Card from "./Card";
import PieDiagramSplitsCounter from "./PieDiagramSplitsCounter";

const { width, height } = Dimensions.get("window");

const Overview = ({ overViewData, hasData }) => {
  const { workoutCount, splitsCounter, workoutPlan } = overViewData;
  const splitsCounterWithColors = useMemo(
    () => splitsCounterToPieData(splitsCounter),
    [splitsCounter]
  );

  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <>
        {Object.entries(splitsCounter).length > 0 &&
          splitsCounterWithColors.map((s) => {
            return (
              <View
                style={{ flexDirection: "row", alignItems: "center" }}
                key={s.text}
              >
                {renderDot(s.color)}
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    color: "white",
                    fontSize: RFValue(15),
                    opacity: 0.8,
                  }}
                >
                  {s.text}: {s.value}
                </Text>
              </View>
            );
          })}
      </>
    );
  };

  return (
    <Card
      style={{ width: "90%", alignSelf: "center", marginTop: height * 0.04 }}
      height={120}
      iconName={"information"}
      iconColor={"white"}
      title={"Overview"}
      subtitle={"Workout performances"}
      useGradient={true}
      gradientColors={["#2979FF", "#2979FF"]}
      titleColor="#E5E7EB"
      subtitleColor="#E5E7EB"
    >
      <View style={{ flexDirection: "column" }}>
        {hasData ? (
          <>
            <View
              style={{
                height: height * 0.3,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PieDiagramSplitsCounter
                  splitsCounterWithColors={splitsCounterWithColors}
                  workoutCount={workoutCount}
                ></PieDiagramSplitsCounter>
              </View>
              <View
                style={{
                  flex: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ gap: height * 0.02 }}>
                  {renderLegendComponent()}
                </View>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: "white",
                    fontSize: RFValue(14),
                  }}
                >
                  {workoutPlan.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    color: "white",
                    fontSize: RFValue(12),
                    opacity: 0.7,
                    marginTop: height * 0.01,
                  }}
                >
                  Workout Name
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: "white",
                    fontSize: RFValue(14),
                  }}
                >
                  {workoutPlan.numberofsplits}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    color: "white",
                    fontSize: RFValue(12),
                    opacity: 0.7,
                    marginTop: height * 0.01,
                  }}
                >
                  Splits Count
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: "white",
                    fontSize: RFValue(14),
                  }}
                >
                  {workoutPlan.created_at
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    color: "white",
                    fontSize: RFValue(12),
                    opacity: 0.7,
                    marginTop: height * 0.01,
                  }}
                >
                  Last Updated
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View>
              <Text>No data</Text>
            </View>
          </>
        )}
      </View>
    </Card>
  );
};

export default Overview;
