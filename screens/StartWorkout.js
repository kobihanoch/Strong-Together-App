import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
} from "react-native";
import Theme1 from "../components/Theme1";
import useExercises from "../hooks/useExercises";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import supabase from "../src/supabaseClient";
import { LinearGradient } from "expo-linear-gradient";
import PageIndicator from "../components/PageIndicator";
import ExerciseItem from "../components/StartWorkoutComponents/ExerciseItem";
import { useAuth } from "../context/AuthContext";
import useStartWorkoutPageLogic from "../hooks/logic/useStartWorkoutPageLogic";
import LoadingPage from "../components/LoadingPage";
import ExerciseBox from "../components/StartWorkoutComponents/ExerciseBox";

const { width, height } = Dimensions.get("window");

const StartWorkout = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const {
    animation,
    data: workoutData,
    loading,
    error,
    weightArrs,
    setWeightArrs,
    repsArrs,
    setRepsArrs,
  } = useStartWorkoutPageLogic(user, route.params?.workoutSplit);

  const flatListRef = useRef(null);
  const workoutTime = route.params?.workoutTime || 0;

  useEffect(() => {
    console.log("Updated weights: " + JSON.stringify(workoutData.weightArrs));
  }, [workoutData.weightArrs]);

  useEffect(() => {
    console.log("Updated reps: " + JSON.stringify(workoutData.repsArrs));
  }, [workoutData.repsArrs]);

  const saveWorkoutDataToDatabase = async () => {
    try {
      const { error } = await supabase.from("exercisetracking").insert(
        workoutData.map(({ weights, reps, ...rest }) => ({
          ...rest,
          weight: weights,
          reps: reps,
        }))
      );

      if (error) throw error;
      console.log("Data inserted successfully:", workoutData);
      Alert.alert("Success", "Workout saved successfully!");

      navigation.navigate("PostWorkoutSummary", {
        workoutData: workoutData,
        workoutSplitID: workoutSplitID,
        userId: userId,
      });
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  if (loading) {
    return <LoadingPage message="Starting workout"></LoadingPage>;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "column",
      }}
    >
      <View style={styles.container}>
        <FlatList
          data={workoutData.exercisesForSelectedSplit}
          horizontal
          ref={flatListRef}
          showsHorizontalScrollIndicator={false}
          centerContent
          pagingEnabled
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <ExerciseBox
              item={item}
              index={index}
              exerciseCount={workoutData.exercisesForSelectedSplit.length}
              onScrollNext={() => {
                flatListRef.current?.scrollToIndex({ index: index + 1 });
              }}
              updateWeightArrs={workoutData.setWeightArrs}
              updateRepsArrs={workoutData.setRepsArrs}
              weightArrs={workoutData.weightArrs}
              repsArrs={workoutData.repsArrs}
            ></ExerciseBox>
          )}
        ></FlatList>
      </View>
      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2979FF",
            borderRadius: height * 0.02,
            width: "50%",
            height: "40%",
            gap: width * 0.03,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: "white",
              fontSize: RFValue(15),
            }}
          >
            Finish Workout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 8 },
  countdownContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00142a",
    zIndex: 1,
  },
  countdownText: {
    fontSize: RFValue(80),
    color: "white",
    fontFamily: "PoppinsBold",
  },
  exerciseContainer: { width, flex: 1, backgroundColor: "white" },
  infoContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exerciseName: {
    fontFamily: "PoppinsBold",
    fontSize: RFValue(20),
    color: "white",
    marginTop: height * 0.03,
  },
  exerciseDescription: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(15),
    color: "#8ca7d1",
    marginTop: height * 0.01,
  },
  setContainer: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
  },
  setLabel: {
    fontSize: RFValue(25),
    color: "#00142a",
  },
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    fontSize: RFValue(18),
    justifyContent: "center",
    textAlign: "center",
  },
});

export default StartWorkout;
