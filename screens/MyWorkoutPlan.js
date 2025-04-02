import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LoadingPage from "../components/LoadingPage";
import ExerciseItem from "../components/MyWorkoutPlanComponents/ExerciseItem";
import WorkoutSplitItem from "../components/MyWorkoutPlanComponents/WorkoutSplitItem";
import { useAuth } from "../context/AuthContext";
import { useMyWorkoutPlanPageLogic } from "../hooks/logic/useMyWorkoutPlanPageLogic.js";

const { width, height } = Dimensions.get("window");

const MyWorkoutPlan = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { data: workoutData, loading, error } = useMyWorkoutPlanPageLogic(user);

  if (loading) {
    return <LoadingPage message="Getting your workout..." />;
  }

  return (
    <View
      style={{ flex: 1, paddingVertical: height * 0.02, alignItems: "center" }}
    >
      {workoutData.workout ? (
        <>
          <View
            style={{
              flex: 0.25,
              width: "80%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FlatList
              data={workoutData.workoutSplits}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              centerContent={true}
              renderItem={({ item }) => (
                <WorkoutSplitItem
                  item={item}
                  exercise_count={workoutData.countExercisesForSplit(
                    workoutData.allExercises,
                    item.id
                  )}
                  isSelected={item.id === workoutData.selectedSplit?.id}
                  onPress={() => workoutData.handleWorkoutSplitPress(item)}
                />
              )}
              snapToInterval={width * 0.8}
              decelerationRate="fast"
              snapToAlignment="center"
              onMomentumScrollEnd={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / (width * 0.8));
                const selected = workoutData.workoutSplits[index];
                if (selected) {
                  workoutData.handleWorkoutSplitPress(selected);
                }
              }}
            />
          </View>

          {/*<View style={{ flex: 0.6 }}>
              <FlatList
                data={workoutData.filteredExercises}
                showsVerticalScroll
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <ExerciseItem exercise={item} />
              />
            </View>*/}
        </>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Text
              style={{ fontSize: RFValue(23), fontFamily: "Inter_700Bold" }}
            >
              No workout available
            </Text>
            <Text
              style={{
                fontSize: RFValue(18),
                fontFamily: "Inter_400Regular",
                color: "gray",
              }}
            >
              Create one to start your journy
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
