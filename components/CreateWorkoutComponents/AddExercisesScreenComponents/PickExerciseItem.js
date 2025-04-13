import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import images from "../../images";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");

const PickExerciseItem = ({ exercise, exercisesInCurrentSplit }) => {
  const { properties } = useCreateWorkout();
  const [isSelected, setIsSelected] = useState(
    exercisesInCurrentSplit.some((ex) => ex.id === exercise.id)
  );

  const mainMuscle = exercise.targetmuscle;
  const specificMuscle = exercise.specifictargetmuscle;
  const imagePath = images[mainMuscle]?.[specificMuscle];

  // Adds to context array
  const toggleExerciseInSplit = (exercise) => {
    const arrayOfSplits = JSON.parse(
      JSON.stringify(properties.selectedExercises)
    );
    arrayOfSplits.forEach((split) => {
      if (split.name == properties.focusedSplit.name) {
        const isSelectedArr = split.exercises.filter(
          (ex) => ex.id !== exercise.id
        );
        const isNotSelectedArr = [...split.exercises, exercise];
        isSelected
          ? (split.exercises = isSelectedArr)
          : (split.exercises = isNotSelectedArr);
      }
    });
    properties.setSelectedExercises(arrayOfSplits);
  };

  return (
    <TouchableOpacity
      style={[
        styles.exerciseContainer,
        isSelected && { borderColor: "#2979FF", borderWidth: 2 },
      ]}
      onPress={() => {
        toggleExerciseInSplit(properties.focusedSplit, exercise);
        if (isSelected) {
          setIsSelected(false);
        } else {
          setIsSelected(true);
        }
      }}
      activeOpacity={0.8}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.35, justifyContent: "center" }}>
          <LinearGradient
            colors={["rgb(234, 240, 246)", "rgb(234, 240, 246)"]}
            style={styles.imageContainer}
          >
            <Image source={imagePath} style={styles.exerciseImage} />
          </LinearGradient>
        </View>

        <View style={styles.exerciseInfoContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.muscleText}>
            {exercise.targetmuscle}, {exercise.specifictargetmuscle}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <FontAwesome5
            name={isSelected ? "check-circle" : "info-circle"}
            size={18}
            color={isSelected ? "#2979FF" : "rgba(82, 82, 82, 0.4)"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "#fafafa",
    width: "100%",
    alignSelf: "center",
    height: height * 0.16,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
    borderColor: "transparent",
    borderWidth: 2,
    padding: width * 0.02,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: width * 0.02,
  },
  exerciseImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    opacity: 0.8,
  },
  exerciseInfoContainer: {
    flex: 0.55,
    justifyContent: "center",
    gap: height * 0.01,
    paddingLeft: width * 0.02,
  },
  exerciseName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(13),
    color: "black",
    width: "100%",
  },
  muscleText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#919191",
  },
  setsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  setBubble: {
    backgroundColor: "#2979FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  setText: {
    color: "white",
    fontSize: RFValue(12),
    fontFamily: "Inter_700Bold",
  },
  editingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  inputsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editingInput: {
    width: 40,
    height: 30,
    borderWidth: 2,
    borderColor: "#2979FF",
    borderRadius: 10,
    textAlign: "center",
    fontSize: RFValue(14),
    backgroundColor: "#fff",
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#2979FF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: RFValue(14),
    fontFamily: "Inter_700Bold",
  },
  iconContainer: {
    flex: 0.1,
    marginRight: width * 0.04,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: height * 0.01,
  },
});

export default PickExerciseItem;
