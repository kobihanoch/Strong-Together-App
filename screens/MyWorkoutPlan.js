import React, { useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import RenderItemExercise from "../components/MyWorkoutPlanComponents/RenderItemExercise.js";
import SplitFlatList from "../components/MyWorkoutPlanComponents/SplitFlatList.js";
import SlidingBottomModal from "../components/SlidingBottomModal.js";
import { useMyWorkoutPlanPageLogic } from "../hooks/logic/useMyWorkoutPlanPageLogic.js";

const { width, height } = Dimensions.get("window");

const MyWorkoutPlan = () => {
  const { hasWorkout, filteredExercises, setSelectedSplit, selectedSplit } =
    useMyWorkoutPlanPageLogic();

  // Modal
  const exRef = useRef(null);

  return hasWorkout ? (
    <View style={styles.container}>
      <View style={{}}>
        {/* Passing setSelectedSplit as a prop for re-rendering the logic hook */}
        <SplitFlatList
          setSelectedSplit={setSelectedSplit}
          selectedSplit={selectedSplit}
          filteredExercises={filteredExercises}
        ></SplitFlatList>
        {/* Sliding Modal For Exercises */}
        <SlidingBottomModal
          title="Exercises"
          ref={exRef}
          data={filteredExercises}
          renderItem={({ item }) => {
            return <RenderItemExercise item={item}></RenderItemExercise>;
          }}
          enableBackDrop={false}
          enablePanDownClose={false}
          snapPoints={["32%", "50%", "85%"]}
          flatListUsage={true}
          initialIndex={0}
        />
      </View>
    </View>
  ) : (
    <View></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: "column",
  },
  header: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(20),
    marginLeft: width * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splitContainer: {
    padding: height * 0.01,
    flex: 1,
    backgroundColor: "white",
    width: width * 0.5,
    borderRadius: width * 0.04,
    borderColor: "#c9c9c9",
    borderWidth: 0.2,
    marginLeft: width * 0.05,
    marginVertical: height * 0.02,
  },
  selectedSplitContainer: {
    backgroundColor: "#00142a",
    width: width * 0.7,
  },
  splitName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(25),
  },
  splitExercises: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#666",
  },
  exerciseContainer: {
    backgroundColor: "#F3F4F6",
    width: "90%",
    alignSelf: "center",
    height: height * 0.14,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
  },
  exerciseName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(16),
    color: "#007bff",
  },
  exerciseDetails: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#555",
    marginTop: height * 0.005,
  },
});

export default MyWorkoutPlan;
