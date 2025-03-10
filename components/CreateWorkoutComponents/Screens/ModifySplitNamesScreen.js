import React, { useState, useRef, useEffect } from "react";
import { View, Text, Dimensions, Alert } from "react-native";
import ModifySplitNamesCard from "../ModifySplitNamesScreenComponents/ModifySplitNamesCard";
import { RFValue } from "react-native-responsive-fontsize";
import GradientedGoToButton from "../../GradientedGoToButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import useWorkoutSplits from "../../../hooks/useWorkoutSplits";
import useSplitExercises from "../../../hooks/useSplitExercises";
import useWorkouts from "../../../hooks/useWorkouts";

const { width, height } = Dimensions.get("window");

function ModifySplitNamesScreen({
  navigation,
  setStep,
  splitsNumber,
  setEditWorkoutSplitName,
  selectedExercisesBySplit = {},
  userId,
}) {
  const { addNewWorkout } = useWorkouts(userId);
  const { createWorkoutSplit } = useWorkoutSplits();
  const { addExerciseToWorkoutSplit } = useSplitExercises();
  const [saving, setSaving] = useState(false);

  const saveWorkoutPlan = async () => {
    if (!userId) {
      console.error("❌ ERROR: User ID is missing!");
      return;
    }

    try {
      console.log("🟢 Starting workout creation...");
      setSaving(true);

      // 1️⃣ יצירת אימון חדש
      const workoutData = await addNewWorkout(
        userId,
        "My New Workout",
        Object.keys(selectedExercisesBySplit).length
      );

      if (!workoutData?.id) {
        throw new Error("❌ Failed to create workout. No ID returned.");
      }

      console.log("✅ Workout created with ID:", workoutData.id);
      const workoutId = workoutData.id;

      // 2️⃣ יצירת פיצולי אימון ושמירתם במפה
      const createdSplits = {};

      for (const splitName of Object.keys(selectedExercisesBySplit)) {
        console.log(`📌 Creating split for: ${splitName}`);

        const splitData = await createWorkoutSplit(workoutId, splitName);
        if (!splitData?.id) {
          throw new Error(`❌ Workout split creation failed for ${splitName}`);
        }

        console.log(`✅ Created split: ${splitName} (ID: ${splitData.id})`);
        createdSplits[splitName] = splitData.id;
      }

      console.log("🔄 Finished saving splits, now handling exercises...");

      // 3️⃣ הכנסת כל תרגיל בנפרד לכל פיצול
      for (const [splitName, exercises] of Object.entries(
        selectedExercisesBySplit
      )) {
        const splitId = createdSplits[splitName];
        if (!splitId) {
          console.warn(
            `⚠️ No split ID found for ${splitName}, skipping exercises.`
          );
          continue;
        }

        console.log(
          `🔍 Adding ${exercises.length} exercises to split ${splitName} (ID: ${splitId})`
        );

        for (const exercise of exercises) {
          const exerciseData = {
            workoutsplit_id: splitId,
            exercise_id: exercise.id,
            created_at: new Date().toISOString(),
          };

          console.log(`📝 Adding exercise:`, exerciseData);

          await addExerciseToWorkoutSplit(exerciseData);
        }

        console.log(`✅ Successfully added all exercises to split ${splitId}`);
      }

      console.log("🏁 Workout plan saved successfully!");
    } catch (error) {
      console.error("❌ Error saving workout plan:", error);
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
      console.log("🔄 Finished saving, updating state.");
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
            fontFamily: "PoppinsBold",
            fontSize: RFValue(17),
            color: "white",
          }}
        >
          Manage your workout plan
        </Text>
        <Text
          style={{
            fontFamily: "PoppinsRegular",
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
                  fontFamily: "PoppinsBold",
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
            disabled={saving}
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
                  fontFamily: "PoppinsBold",
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
