// CreateWorkout.js - Manages overall workout creation and state
import React, { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import PickSplitNumberScreen from "../components/CreateWorkoutComponents/Screens/PickSplitNumberScreen";
import ModifySplitNamesScreen from "../components/CreateWorkoutComponents/Screens/ModifySplitNamesScreen";
import AddExercisesScreen from "../components/CreateWorkoutComponents/Screens/AddExercisesScreen";
import useExercises from "../hooks/useExercises";
// TOMORROW: ADD A HOOK TO FETCH CURRRENT WORKOUT - IF EXISTS LOAD IT HERE
import { useUserWorkout } from "../hooks/useUserWorkout";

const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  const { user } = useAuth();
  const { userWorkout, loading, error } = useUserWorkout(user?.id);

  const [splitsNumber, setSplitsNumber] = useState(1);
  const { exercises, setExercises } = useExercises();
  const [step, setStep] = useState(1);
  const [editWorkoutSplitName, setEditWorkoutSplitName] = useState("A");

  const initializeSplits = (splitsNumber) => {
    if (
      !selectedExercisesBySplit ||
      Object.keys(selectedExercisesBySplit).length === 0
    ) {
      if (!splitsNumber || splitsNumber <= 0) return {};
      return Array.from({ length: splitsNumber }, (_, i) =>
        String.fromCharCode(65 + i)
      ) // ["A", "B", "C"...]
        .reduce((acc, split) => {
          acc[split] = [];
          return acc;
        }, {});
    }
  };

  const [selectedExercisesBySplit, setSelectedExercisesBySplit] = useState(
    selectedExercisesBySplit && Object.keys(selectedExercisesBySplit).length > 0
      ? selectedExercisesBySplit
      : initializeSplits(splitsNumber)
  );

  // Handling assigned workout if exists
  useEffect(() => {
    (async () => {
      if (userWorkout && userWorkout.length > 0) {
        setSplitsNumber(userWorkout[0].numberofsplits);

        // Creates a dictionary with assigned workout to pass as an argument
        const excDict = {};

        userWorkout[0].workoutsplits.forEach((split) => {
          excDict[split.name] = [...split.exercisetoworkoutsplit];
        });

        // Sorting the dictionary
        const sortedExcDict = Object.keys(excDict)
          .sort()
          .reduce((acc, key) => {
            acc[key] = excDict[key];
            return acc;
          }, {});

        // Make this dict. main
        setSelectedExercisesBySplit(sortedExcDict);
      }
    })();
  }, [userWorkout]);

  // Going towards step 2 if already has a workout
  useEffect(() => {
    if (userWorkout && userWorkout.length > 0) {
      setStep(2);
    }
  }, [userWorkout]);

  useEffect(() => {
    if (!selectedExercisesBySplit) return;

    const allowedSplits = Array.from({ length: splitsNumber }, (_, i) =>
      String.fromCharCode(65 + i)
    ); // ['A', 'B', 'C', ...]

    const updated = {};
    allowedSplits.forEach((split) => {
      updated[split] = selectedExercisesBySplit[split] || [];
    });

    setSelectedExercisesBySplit(updated);
  }, [splitsNumber]);

  return (
    <LinearGradient
      colors={["#0d2540", "#123257"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, paddingVertical: height * 0.02 }}
    >
      {step === 1 && (
        <PickSplitNumberScreen
          setStep={setStep}
          setSplitsNumber={setSplitsNumber}
        />
      )}
      {step === 2 && (
        <ModifySplitNamesScreen
          setStep={setStep}
          splitsNumber={splitsNumber}
          setEditWorkoutSplitName={setEditWorkoutSplitName}
          selectedExercisesBySplit={selectedExercisesBySplit}
          navigation={navigation}
          setSelectedExercisesBySplit={setSelectedExercisesBySplit}
          userId={user.id}
          userWorkout={userWorkout}
        />
      )}
      {step === 3 && (
        <AddExercisesScreen
          setStep={setStep}
          workoutSplitName={editWorkoutSplitName}
          exercises={exercises}
          selectedExercisesBySplit={selectedExercisesBySplit}
          setSelectedExercisesBySplit={setSelectedExercisesBySplit}
        />
      )}
    </LinearGradient>
  );
}

export default CreateWorkout;
