// CreateWorkout.js - Manages overall workout creation and state
import React from "react";
import { Dimensions, View } from "react-native";
import AddExercisesScreen from "../components/CreateWorkoutComponents/Screens/AddExercisesScreen";
import ModifySplitNamesScreen from "../components/CreateWorkoutComponents/Screens/ModifySplitNamesScreen";
import PickSplitNumberScreen from "../components/CreateWorkoutComponents/Screens/PickSplitNumberScreen";
import {
  CreateWorkoutProvider,
  useCreateWorkout,
} from "../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  return (
    <CreateWorkoutProvider>
      <InnerCreateWorkout />
    </CreateWorkoutProvider>
  );
}

const InnerCreateWorkout = () => {
  const { properties } = useCreateWorkout();

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: height * 0.02,
        backgroundColor: "transparent",
      }}
    >
      {properties.currentStep === 1 && <PickSplitNumberScreen />}
      {properties.currentStep === 2 && <ModifySplitNamesScreen />}
      {properties.currentStep === 3 && <AddExercisesScreen />}
    </View>
  );
};

export default CreateWorkout;
