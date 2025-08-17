import React from "react";
import { Dimensions, View, Text } from "react-native";

import {
  CreateWorkoutProvider,
  useCreateWorkout,
} from "../context/CreateWorkoutContext";
import SplitTabsRow from "../components/CreateWorkoutComponents/SplitTabsRow";
import SelectedExercisesList from "../components/CreateWorkoutComponents/SelectedExercisesList";

const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  return (
    <CreateWorkoutProvider>
      <InnerCreateWorkout />
    </CreateWorkoutProvider>
  );
}

const InnerCreateWorkout = () => {
  // Pull flags and data from context
  const { properties } = useCreateWorkout();

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: height * 0.02,
        backgroundColor: "transparent",
      }}
    >
      {properties?.hasWorkout ? (
        <View style={{ flex: 1, alignItems: "stretch" }}>
          <SplitTabsRow />
          <SelectedExercisesList />
        </View>
      ) : (
        <View>
          <Text>Doesn't have workout</Text>
        </View>
      )}
    </View>
  );
};

export default CreateWorkout;
