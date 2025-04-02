import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

const WorkoutSplitItem = ({ item, exercise_count, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.splitContainer,
        isSelected && styles.selectedSplitContainer,
      ]}
      onPress={onPress}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Text
          style={[styles.splitName, { color: isSelected ? "white" : "black" }]}
        >
          {item.name}
        </Text>

        <Text
          style={[
            styles.splitExercises,
            { color: isSelected ? "white" : "black" },
          ]}
        >
          {exercise_count} exercises
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  splitContainer: {
    padding: height * 0.01,
    flex: 1,
    height: "100%",
    width: width * 0.8,
    backgroundColor: "white",
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
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(40),
  },
  splitExercises: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#666",
  },
});

export default WorkoutSplitItem;
