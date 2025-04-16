import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");

function WorkoutGenericBuildSettingsCard({ setSplitsNumber }) {
  const { properties } = useCreateWorkout();

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: width * 0.09,
        justifyContent: "center",
        alignItems: "center",
        gap: height * 0.04,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "column", gap: height * 0.02 }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(15),
            color: "#0d2540",
            textAlign: "center",
          }}
        >
          Choose your amount of workouts
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignItems: "center",
          gap: width * 0.08,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            properties.setSplitsNumber(
              Math.max(1, properties.splitsNumber - 1)
            );
            if (!properties.isNewWorkout) {
              properties.setIsNewWorkout(true);
            }
          }}
        >
          <FontAwesome5
            name="minus"
            size={RFValue(35)}
            color={"#2979FF"}
          ></FontAwesome5>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: RFValue(30),
            fontFamily: "Inter_700Bold",
            width: width * 0.05,
            color: "#2979FF",
          }}
        >
          {properties.splitsNumber}
        </Text>
        <TouchableOpacity
          onPress={() => {
            properties.setSplitsNumber(
              Math.min(6, properties.splitsNumber + 1)
            );
            if (!properties.isNewWorkout) {
              properties.setIsNewWorkout(true);
            }
          }}
        >
          <FontAwesome5
            name="plus"
            size={RFValue(35)}
            color={"#2979FF"}
          ></FontAwesome5>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default WorkoutGenericBuildSettingsCard;
