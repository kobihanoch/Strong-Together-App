// CreateWorkout.js - Manages overall workout creation and state
import React, { useState, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import PickSplitNumberScreen from "../components/CreateWorkoutComponents/Screens/PickSplitNumberScreen";
import ModifySplitNamesScreen from "../components/CreateWorkoutComponents/Screens/ModifySplitNamesScreen";
import AddExercisesScreen from "../components/CreateWorkoutComponents/Screens/AddExercisesScreen";
import useExercises from "../hooks/useExercises";

const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  const { user } = useAuth();
  const [splitsNumber, setSplitsNumber] = useState(1);
  const { exercises } = useExercises();
  const [step, setStep] = useState(1);
  const [editWorkoutSplitName, setEditWorkoutSplitName] = useState("A");
  const initializeSplits = (splitsNumber) => {
    if (!splitsNumber || splitsNumber <= 0) return {}; // אם אין פיצולים, מחזירים אובייקט ריק

    return Array.from({ length: splitsNumber }, (_, i) =>
      String.fromCharCode(65 + i)
    ) // ["A", "B", "C"...]
      .reduce((acc, split) => {
        acc[split] = [];
        return acc;
      }, {});
  };

  const [selectedExercisesBySplit, setSelectedExercisesBySplit] = useState(
    selectedExercisesBySplit && Object.keys(selectedExercisesBySplit).length > 0
      ? selectedExercisesBySplit
      : initializeSplits(splitsNumber)
  );

  useEffect(() => {
    setSelectedExercisesBySplit(initializeSplits(splitsNumber));
  }, [splitsNumber]);

  console.log("All exercises selected: ", selectedExercisesBySplit);

  useEffect(() => {
    console.log("🔄 splitsNumber changed:", splitsNumber);
    setSelectedExercisesBySplit(initializeSplits(splitsNumber));
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
