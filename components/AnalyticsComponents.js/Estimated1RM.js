// English comments only inside the code

import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Card from "./Card";

const { width, height } = Dimensions.get("window");

const Estimated1RM = ({ exercises, onSeeAll }) => {
  // Demo data (remove when wiring real props)
  exercises = exercises ?? {
    1: {
      id: 371,
      reps: 5,
      weight: 160,
      exercise: "Squat",
      exercise_id: 1,
      workoutdate: "2025-07-11",
      exercisetosplit_id: 775,
      est1RM: 180,
    },
    2: {
      id: 537,
      reps: 12,
      weight: 109,
      exercise: "Leg Extensions",
      exercise_id: 2,
      workoutdate: "2025-08-20",
      exercisetosplit_id: 1270,
      est1RM: 200,
    },
    5: {
      id: 370,
      reps: 12,
      weight: 55,
      exercise: "Leg Curl",
      exercise_id: 5,
      workoutdate: "2025-07-11",
      exercisetosplit_id: 774,
      est1RM: 110,
    },
    6: {
      id: 541,
      reps: 8,
      weight: 40,
      exercise: "Walking Lunges",
      exercise_id: 6,
      workoutdate: "2025-08-20",
      exercisetosplit_id: 1274,
      est1RM: 80,
    },
    7: {
      id: 394,
      reps: 2,
      weight: 220,
      exercise: "Leg Press",
      exercise_id: 7,
      workoutdate: "2025-07-17",
      exercisetosplit_id: 776,
      est1RM: 350,
    },
  };

  return (
    <Card
      style={{ width: "90%", alignSelf: "center", marginTop: height * 0.02 }}
      height={120}
      title={"Estimated PRs"}
      subtitle={"Applied from your records so far"}
      titleColor="#000000ff"
      subtitleColor="#797979ff"
      iconColor="black"
      iconName={"medal"}
    >
      {/* Rows list */}
      <View
        style={{ height: height * 0.3, flexDirection: "column", marginTop: 10 }}
      >
        {Object.entries(exercises)
          .slice(0, 4)
          .map(([exId, recordData]) => (
            <View
              key={exId}
              style={{
                width: "100%",
                marginTop: height * 0.01,
                paddingHorizontal: 10,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                borderColor: "rgba(233, 233, 233, 1)",
                borderWidth: 1,
                borderRadius: width * 0.02,
                height: height * 0.068,
              }}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.04)",
                }}
              >
                <FontAwesome5
                  name="dumbbell"
                  size={RFValue(12)}
                  color="black"
                />
              </View>

              <View
                style={{ flexDirection: "column", paddingLeft: 15, flex: 7 }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    color: "black",
                    fontSize: RFValue(13),
                  }}
                >
                  {recordData.exercise}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    color: "black",
                    fontSize: RFValue(10),
                  }}
                >
                  {recordData.weight} x {recordData.reps}
                </Text>
              </View>

              <View style={{ flexDirection: "column", flex: 2 }}>
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    color: "black",
                    fontSize: RFValue(13),
                    textAlign: "right",
                  }}
                >
                  {recordData.est1RM} kg
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    color: "black",
                    fontSize: RFValue(8),
                    textAlign: "right",
                  }}
                >
                  Est. 1RM
                </Text>
              </View>
            </View>
          ))}
      </View>

      {/* Bottom interactive footer button */}
      <TouchableOpacity
        onPress={onSeeAll}
        activeOpacity={0.7}
        style={{
          alignSelf: "flex-end",
          marginTop: 25,
          paddingHorizontal: 8,
          paddingVertical: 6,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: "rgba(0,0,0,0.04)",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_500Medium",
            color: "black",
            fontSize: RFValue(12),
          }}
        >
          See all
        </Text>
        <FontAwesome5 name="chevron-right" size={RFValue(10)} color="black" />
      </TouchableOpacity>
    </Card>
  );
};

export default Estimated1RM;
