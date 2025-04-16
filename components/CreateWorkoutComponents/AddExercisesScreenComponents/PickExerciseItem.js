import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";
import images from "../../images";
import StepperInput from "../../StepperInput";

const { width, height } = Dimensions.get("window");

const PickExerciseItem = ({ exercise, exercisesInCurrentSplit }) => {
  const { properties, utils } = useCreateWorkout();
  const [isSelected, setIsSelected] = useState(
    exercisesInCurrentSplit.some((ex) => ex.exercise_id === exercise.id)
  );

  const mainMuscle = exercise.targetmuscle;
  const specificMuscle = exercise.specifictargetmuscle;
  const imagePath = images[mainMuscle]?.[specificMuscle];

  // For showing modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // WIP: add modal and then add setFocusedExerciseSets and then put it inside the selectedExercises List

  return (
    <View style={{ marginBottom: height * 0.0 }}>
      <View style={{ position: "relative" }}>
        {/* Main Touchable: Select/Deselect Exercise */}
        <TouchableOpacity
          style={[
            styles.exerciseContainer,
            isSelected && { borderColor: "#2979FF", borderWidth: 2 },
          ]}
          onPress={() => {
            utils.toggleExerciseInSplit(exercise, isSelected);

            if (isSelected) {
              setIsSelected(false);
            } else {
              setIsSelected(true);
            }
          }}
          activeOpacity={0.8}
        >
          {/* Content inside the card */}
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.muscleText}>
                  {exercise.targetmuscle}, {exercise.specifictargetmuscle}
                </Text>
              </View>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesome5
                name={isSelected ? "check-circle" : "info-circle"}
                size={18}
                color={isSelected ? "transparent" : "rgba(82, 82, 82, 0.4)"}
              />
            </View>
          </View>
        </TouchableOpacity>

        {isSelected && (
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
              properties.setFocusedExercise(exercise);
            }}
            activeOpacity={0.85}
            style={{
              position: "absolute",
              top: height * 0.03,
              right: width * 0.04,
              backgroundColor: "#2979FF",
              borderRadius: width * 0.08,
              padding: width * 0.03,
              shadowColor: "rgb(90, 90, 90)",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 6,
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={RFValue(13)}
              color="white"
            />
          </TouchableOpacity>
        )}

        {isModalVisible && (
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: width * 0.05,
              }}
            >
              <View
                style={{
                  width: width * 0.9,
                  backgroundColor: "#fff",
                  borderRadius: width * 0.05,
                  paddingVertical: height * 0.03,
                  paddingHorizontal: width * 0.05,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter_700Bold",
                    fontSize: RFValue(16),
                    marginBottom: height * 0.02,
                    color: "#1a1a1a",
                  }}
                >
                  Edit Reps for {exercise.name}
                </Text>

                {properties.focusedExerciseSets?.map((reps, index) => (
                  <View
                    key={index}
                    style={{
                      width: "70%",
                      marginBottom: height * 0.015,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_500Medium",
                        fontSize: RFValue(13),
                        color: "#444",
                        marginBottom: height * 0.005,
                        alignSelf: "center",
                      }}
                    >
                      Set {index + 1}
                    </Text>

                    <StepperInput
                      value={properties.focusedExerciseSets[index]}
                      onChange={(newVal) => {
                        const updated = [...properties.focusedExerciseSets];
                        updated[index] = newVal;
                        properties.setFocusedExerciseSets(updated);
                      }}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(false);
                    // Update the big array with the focused selected exercise sets array, and set focused exercise to null
                    properties.setFocusedExercise(null);
                    // If by mistake a field is without a value - automaticly make it 10 by default
                    const cleanedSets = properties.focusedExerciseSets.map(
                      (val) =>
                        !val || val === "" || isNaN(val) ? 10 : parseInt(val)
                    );
                    utils.updateSetsForExercise(exercise, cleanedSets);
                  }}
                  style={{
                    marginTop: height * 0.015,
                    backgroundColor: "#2979FF",
                    paddingVertical: height * 0.014,
                    paddingHorizontal: width * 0.2,
                    borderRadius: width * 0.03,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Inter_700Bold",
                      fontSize: RFValue(14),
                      textAlign: "center",
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
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
