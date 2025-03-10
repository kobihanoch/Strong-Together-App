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
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [splitsNumber, setSplitsNumber] = useState(1);
  const { exercises, error } = useExercises(); // Fetching all exercises
  const [step, setStep] = useState(1);
  const [editWorkoutSplitName, setEditWorkoutSplitName] = useState("A"); // Going to step 3 to know which split is editing

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setUserId(user.id);
    }
  }, [user]);

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
        />
      )}
      {step === 3 && (
        <AddExercisesScreen
          setStep={setStep}
          workoutSplitName={editWorkoutSplitName}
          exercises={exercises}
        />
      )}
    </LinearGradient>
  );
}

export default CreateWorkout;
