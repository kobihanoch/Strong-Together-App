import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCreateWorkout } from "../../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");

const MuscleTabs = ({ overrideSelected, onSelectMuscle }) => {
  const { properties, DB } = useCreateWorkout();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(
    overrideSelected ?? properties?.muscles?.[0]
  );

  // Sync local selected with override if provided
  useEffect(() => {
    if (overrideSelected != null) setSelectedMuscleGroup(overrideSelected);
  }, [overrideSelected]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: height * 0.02,
        paddingHorizontal: width * 0.01,
      }}
    >
      {(properties?.muscles ?? []).map((muscle, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedMuscleGroup(muscle);
            onSelectMuscle?.(muscle);
          }}
          activeOpacity={0.9}
          style={{
            backgroundColor:
              selectedMuscleGroup === muscle ? "#2979FF" : "rgb(234, 240, 246)",
            borderRadius: width * 0.02,
            marginHorizontal: width * 0.01,
            minWidth: width * 0.2,
            height: Math.max(36, height * 0.045),
            paddingHorizontal: 10,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: RFValue(11),
              color: selectedMuscleGroup === muscle ? "white" : "#111",
              fontFamily: "Inter_600SemiBold",
            }}
            numberOfLines={1}
          >
            {muscle}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MuscleTabs;
