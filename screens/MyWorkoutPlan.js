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
  const {
    workout,
    workoutSplits,
    allExercises,
    loading,
    error,
    selectedSplit,
    handleWorkoutSplitPress,
    filteredExercises,
    countExercisesForSplit,
    buttonOpacity,
  } = useMyWorkoutPlanPageLogic(user);

  if (loading) {
    return <LoadingPage message="Getting your workout..." />;
  }

  return (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      {workout ? (
        <>
          <View
            style={{
              flex: 0.15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: width * 0.06,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: RFValue(16),
                  color: "black",
                }}
              >
                Your workouts
              </Text>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: RFValue(13),
                  color: "#999999",
                }}
              >
                Select a workout to start
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  height: height * 0.07,
                  width: height * 0.13,
                  backgroundColor: "#0d2540",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: width * 0.5,
                  opacity: buttonOpacity,
                  shadowColor: "#00142a",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 5,
                  elevation: 5,
                }}
                onPress={() =>
                  navigation.navigate("StartWorkout", {
                    workoutSplit: selectedSplit,
                  })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5 name="bolt" size={15} color="#FACC15" />
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: RFValue(12),
                      color: "white",
                      marginLeft: 10,
                    }}
                  >
                    Start
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flex: 0.3,
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <FlatList
              data={workoutSplits}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal={true}
              renderItem={({ item }) => (
                <WorkoutSplitItem
                  item={item}
                  exercise_count={countExercisesForSplit(allExercises, item.id)}
                  isSelected={item.id === selectedSplit?.id}
                  onPress={() => handleWorkoutSplitPress(item)}
                />
              )}
            />
          </View>

          <View style={{ flex: 0.55 }}>
            <FlatList
              data={filteredExercises}
              showsVerticalScroll
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <ExerciseItem exercise={item} />}
            />
          </View>
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
