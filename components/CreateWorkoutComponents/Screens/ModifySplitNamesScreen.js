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

const { width, height } = Dimensions.get("window");

function ModifySplitNamesScreen({
  navigation,
  setStep,
  splitsNumber,
  setEditWorkoutSplitName,
  selectedExercisesBySplit,
  userId,
  setSelectedExercisesBySplit,
  userWorkout,
}) {
  const { addNewWorkout } = useWorkouts(userId);
  const { createWorkoutSplit } = useWorkoutSplits();
  const { addExerciseToWorkoutSplit } = useSplitExercises();
  const [saving, setSaving] = useState(false);
  const { deleteUserWorkout, error, loading } = useDeleteWorkout();

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    const hasEmptySplit = Object.values(selectedExercisesBySplit).some(
      (exercises) => !exercises || exercises.length === 0
    );

    console.log("Selected Exercises By Split:", selectedExercisesBySplit);
    console.log("isSaveDisabled:", hasEmptySplit);

    setIsSaveDisabled(hasEmptySplit);
  }, [selectedExercisesBySplit]);

  // Save workout
  const saveWorkoutPlan = async () => {
    if (!userId) {
      console.error("ERROR: User ID is missing!");
      return;
    }

    try {
      console.log("Initiating workout creation...");
      setSaving(true);

      // Check if user already has a workout
      if (userWorkout && userWorkout.length > 0) {
        // Update
        console.log("Deleting workout");
        try {
          await deleteUserWorkout(userId);
          console.log("Workout successfully deleted.");
        } catch (err) {
          Alert.alert("Error", err.message || "Something went wrong");
        }
      }

      console.log("Creating workout");
      // Create a new workout
      const workoutData = await addNewWorkout(
        userId,
        "My New Workout",
        Object.keys(selectedExercisesBySplit).length
      );

      console.log("WOrkout id: " + workoutData.id);
      if (!workoutData?.id) {
        throw new Error("Failed to create workout. No ID returned.");
      }

      const workoutId = workoutData.id;

      // Create workout splits and store their IDs
      const createdSplits = {};

      for (const splitName of Object.keys(selectedExercisesBySplit)) {
        const splitData = await createWorkoutSplit(workoutId, splitName);
        if (!splitData[0]?.id) {
          throw new Error(`Workout split creation failed for ${splitName}`);
        }

        createdSplits[splitName] = splitData[0].id;
      }

      // Assign exercises to each workout split with their corresponding sets
      for (const [splitName, exercises] of Object.entries(
        selectedExercisesBySplit
      )) {
        const splitId = createdSplits[splitName];
        if (!splitId) continue;

        for (const exercise of exercises) {
          await addExerciseToWorkoutSplit(
            splitId,
            exercise.exercise_id || exercise.id,
            exercise.sets || ["10", "10", "10"]
          );
        }
      }

      console.log("🏁 Workout plan successfully saved.");

      // Navigate to the Home screen after successful save
      Alert.alert("Success", "Workout has been saved successfully!", [
        { text: "OK", onPress: () => navigation.navigate("MyWorkoutPlan") },
      ]);
    } catch (error) {
      console.error("Error saving workout plan:", error);
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

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
            fontFamily: "Inter_700Bold",
            fontSize: RFValue(17),
            color: "white",
          }}
        >
          Manage your workout plan
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(12),
            opacity: 0.5,
            color: "white",
          }}
        >
          Add exercises to create the best plan out there!
        </Text>
      </View>

      <View style={{ flex: 7 }}>
        <ModifySplitNamesCard
          splitsNumber={splitsNumber}
          setEditWorkoutSplitName={setEditWorkoutSplitName}
          setStep={setStep}
          selectedExercisesBySplit={selectedExercisesBySplit}
        />
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
            gradientColors={["#FF9500", "#FF6B00"]}
            borderRadius={height * 0.1}
            onPress={() => setStep(1)}
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
              <FontAwesome5
                name="arrow-left"
                color="white"
                size={RFValue(17)}
              />
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
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
            gradientColors={["rgb(0, 148, 12)", "rgb(0, 98, 8)"]}
            borderRadius={height * 0.1}
            onPress={saveWorkoutPlan}
            disabled={saving || isSaveDisabled}
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
                  fontFamily: "Inter_700Bold",
                  color: "white",
                  fontSize: RFValue(15),
                }}
              >
                {saving ? "Saving..." : "Save"}
              </Text>
              <FontAwesome5 name="check" color="white" size={RFValue(17)} />
            </View>
          </GradientedGoToButton>
        </View>
      </View>
    </View>
  );
}

export default ModifySplitNamesScreen;
