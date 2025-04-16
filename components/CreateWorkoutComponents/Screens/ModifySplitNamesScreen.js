import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useDeleteWorkout } from "../../../hooks/useDeleteWorkout";
import useSplitExercises from "../../../hooks/useSplitExercises";
import useWorkouts from "../../../hooks/useWorkouts";
import useWorkoutSplits from "../../../hooks/useWorkoutSplits";
import GradientedGoToButton from "../../GradientedGoToButton";
import ModifySplitNamesCard from "../ModifySplitNamesScreenComponents/ModifySplitNamesCard";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

function ModifySplitNamesScreen() {
  const { properties, saving } = useCreateWorkout();

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        paddingHorizontal: width * 0.05,
      }}
    >
      <View
        style={{
          flex: 1.5,
          flexDirection: "column",
          gap: height * 0.01,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: RFValue(20),
            color: "black",
          }}
        >
          Manage your workout plan
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(15),
            opacity: 0.5,
            color: "rgb(92, 92, 92)",
          }}
        >
          Add exercises to create the best plan out there!
        </Text>
      </View>

      <View style={{ flex: 7 }}>
        <ModifySplitNamesCard />
      </View>

      <View
        style={{
          flex: 1.5,
          alignItems: "center",
          flexDirection: "row",
          gap: width * 0.04,
          justifyContent: "center",
        }}
      >
        <View style={{ width: "30%" }}>
          <GradientedGoToButton
            gradientColors={["#2979FF", "#2979FF"]}
            borderRadius={height * 0.1}
            onPress={() => properties.setCurrentStep(1)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: width * 0.04,
                alignItems: "center",
                opacity: 1,
              }}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                color="white"
                size={RFValue(17)}
              />
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: "white",
                  fontSize: RFValue(15),
                }}
              >
                Back
              </Text>
            </View>
          </GradientedGoToButton>
        </View>

        <View style={{ width: "30%" }}>
          <GradientedGoToButton
            gradientColors={["#2979FF", "#2979FF"]}
            borderRadius={height * 0.1}
            onPress={saving.saveWorkout}
            disabled={!saving.canSave}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: width * 0.04,
                alignItems: "center",
                opacity: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: "white",
                  fontSize: RFValue(15),
                }}
              >
                {/*saving ? "Saving..." : "Save"*/}Save
              </Text>
              <MaterialCommunityIcons
                name="check"
                color="white"
                size={RFValue(17)}
              />
            </View>
          </GradientedGoToButton>
        </View>
      </View>
    </View>
  );
}

export default ModifySplitNamesScreen;
