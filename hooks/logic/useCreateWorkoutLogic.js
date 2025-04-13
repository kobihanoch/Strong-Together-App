// CreateWorkout.js - Manages overall workout creation and state
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserWorkout } from "../useUserWorkout";

const useCreateWorkoutLogic = () => {
  const { user } = useAuth();
  const { workout, workoutSplits, exercises, loading, error } = useUserWorkout(
    user?.id
  );

  const [splitsNumber, setSplitsNumber] = useState(1);
  const [step, setStep] = useState(1);
  const [editWorkoutSplitName, setEditWorkoutSplitName] = useState("A");

  useEffect(() => {
    // TODO: fetch or logic here
  }, []);

  return {
    workout: {
      workout,
      workoutSplits,
      exercises,
    },
    user: {
      user,
    },
    properties: {
      splitsNumber,
      setSplitsNumber,
      step,
      setStep,
      editWorkoutSplitName,
    },
    loading,
    error,
  };
};

export default useCreateWorkoutLogic;
