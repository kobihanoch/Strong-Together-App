import React from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const MuscleTabs = ({ muscleGroups, selectedMuscleGroup, onSelectMuscle }) => {
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
      {muscleGroups.map((muscle, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelectMuscle(muscle)}
          style={{
            backgroundColor:
              selectedMuscleGroup === muscle ? "#0d2540" : "#ccc",
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
              fontFamily: "Inter_700Bold",
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
