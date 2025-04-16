import React, { useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");

const MuscleTabs = () => {
  const { properties, utils, DB } = useCreateWorkout();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(
    properties.muscles[0]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: height * 0.02,
      }}
    >
      {properties.muscles.map((muscle, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            // Filter the viewd exercises by muscle
            properties.setFilteredExercises(
              utils.filterExercisesByMuscle(muscle, DB.dbExercises)
            );
            setSelectedMuscleGroup(muscle);
          }}
          style={{
            backgroundColor:
              selectedMuscleGroup === muscle ? "#2979FF" : "rgb(234, 240, 246)",
            borderRadius: width * 0.02,
            marginHorizontal: width * 0.01,
            width: width * 0.2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(11),
              color: selectedMuscleGroup === muscle ? "white" : "black",
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {muscle}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MuscleTabs;
