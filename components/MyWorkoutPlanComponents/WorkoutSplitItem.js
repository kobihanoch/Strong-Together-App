import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const WorkoutSplitItem = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.splitContainer,
        isSelected && styles.selectedSplitContainer,
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.splitName, { color: isSelected ? "white" : "black" }]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  splitContainer: {
    flex: 1,
    height: "85%",
    width: width * 0.2,
    backgroundColor: "rgb(234, 240, 246)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  selectedSplitContainer: {
    backgroundColor: "#2979FF",
  },
  splitName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(20),
  },
  splitExercises: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#666",
  },
});

export default WorkoutSplitItem;
