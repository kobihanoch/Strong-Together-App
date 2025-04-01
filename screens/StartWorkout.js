import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GradientedGoToButton from "../components/GradientedGoToButton";
import PageIndicator from "../components/PageIndicator";
import ExerciseItem from "../components/StartWorkoutComponents/ExerciseItem";
import { useAuth } from "../context/AuthContext";
import useExercises from "../hooks/useExercises";
import supabase from "../src/supabaseClient";

const { width, height } = Dimensions.get("window");

const StartWorkout = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const [userId, setUserId] = useState(null);

  const workoutTime = route.params?.workoutTime || 0;

  useEffect(() => {
    // Loading when user is updating
    if (user && user.id) {
      setUserId(user.id);
      console.log("User ID:", user.id);
    }
  }, [user]);

  const { workoutSplit } = route.params;
  const [workoutSplitID, setWorkoutSplitID] = useState(0);
  const { exercises, error } = useExercises(workoutSplit.id);

  const [workoutData, setWorkoutData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(1);
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownValue, setCountdownValue] = useState(3);
  const flatListRef = useRef(null);
  const innerFlatListRef = useRef(null);
  const glowAnimation = useRef(new Animated.Value(1)).current;
  const countdownScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (workoutSplit && workoutSplit.id) {
      setWorkoutSplitID(workoutSplit.id);
    }
  }, [workoutSplit]);

  useEffect(() => {
    if (showCountdown) {
      const interval = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setShowCountdown(false);
          }
          return prev - 1;
        });
      }, 1000);

      Animated.loop(
        Animated.sequence([
          Animated.timing(countdownScale, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(countdownScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showCountdown]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 50,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.delay(300),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnimation]);

  const handleScrollToIndexFailed = () => {
    setTimeout(() => {
      if (innerFlatListRef.current) {
        innerFlatListRef.current.scrollToIndex({ index: 0, animated: true });
      }
    }, 100);
  };

  const handleUpdateSet = (exercisetosplit_id, weight, reps, index) => {
    setWorkoutData((prevData) => {
      const existingExercise = prevData.find(
        (item) => item.exercisetosplit_id === exercisetosplit_id
      );
      if (existingExercise) {
        const updatedWeights = [...existingExercise.weights];
        const updatedReps = [...existingExercise.reps];

        if (weight !== null) updatedWeights[index] = weight;
        if (reps !== null) updatedReps[index] = reps;

        return prevData.map((item) =>
          item.exercisetosplit_id === exercisetosplit_id
            ? {
                ...item,
                weights: updatedWeights.filter((w) => w !== null),
                reps: updatedReps.filter((r) => r !== null),
              }
            : item
        );
      } else {
        const weights = Array(index + 1).fill(null);
        const reps = Array(index + 1).fill(null);

        if (weight !== null) weights[index] = weight;
        if (reps !== null) reps[index] = reps;

        return [
          ...prevData,
          {
            exercisetosplit_id,
            workoutdate: new Date().toISOString().split("T")[0],
            weights: weights.filter((w) => w !== null),
            reps: reps.filter((r) => r !== null),
          },
        ];
      }
    });
  };

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

  const renderExerciseItem = ({ item }) => (
    <ExerciseItem
      item={item}
      currentIndex={currentIndex}
      flatListHeight={flatListHeight}
      currentSetIndex={currentSetIndex}
      glowAnimation={glowAnimation}
      handleUpdateSet={handleUpdateSet}
      innerFlatListRef={innerFlatListRef}
      setFlatListHeight={setFlatListHeight}
      setCurrentSetIndex={setCurrentSetIndex}
      flatListRef={flatListRef}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0d2540" }}>
      <View style={styles.container}>
        {showCountdown ? (
          <View style={styles.countdownContainer}>
            <Animated.Text
              style={[
                styles.countdownText,
                { transform: [{ scale: countdownScale }] },
              ]}
            >
              {countdownValue > 0 ? countdownValue : "START!"}
            </Animated.Text>
          </View>
        ) : (
          <>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: height * 0.02,
                backgroundColor: "#0d2540",
              }}
            >
              <View
                style={{
                  height: height * 0.02,
                  marginVertical: height * 0.02,
                  width: width * 0.35,
                }}
              >
                <GradientedGoToButton
                  gradientColors={["#FF6347", "#FF4500"]}
                  borderRadius={height * 0.08}
                  onPress={saveWorkoutDataToDatabase}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      opacity: 0.8,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: RFValue(10),
                        fontFamily: "Inter_700Bold",
                      }}
                    >
                      Finish Workout
                    </Text>
                    <FontAwesome5
                      name={"stopwatch"}
                      size={RFValue(13)}
                      color={"white"}
                      style={{ marginLeft: width * 0.02 }}
                    ></FontAwesome5>
                  </View>
                </GradientedGoToButton>
              </View>
            </View>
            <PageIndicator
              totalPages={exercises.length}
              currentPage={currentIndex}
              activeColor="white"
              inactiveColor="#8ca7d1"
            />
            <FlatList
              ref={flatListRef}
              data={exercises}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={width}
              decelerationRate="fast"
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderExerciseItem}
              onScroll={({ nativeEvent }) => {
                const index = Math.round(nativeEvent.contentOffset.x / width);
                if (index !== currentIndex) {
                  setCurrentIndex(index);
                  setCurrentSetIndex(1);

                  if (innerFlatListRef.current) {
                    innerFlatListRef.current.scrollToIndex({
                      index: 0,
                      animated: true,
                    });
                  }
                }
              }}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    fontFamily: "Inter_700Bold",
  },
  exerciseContainer: { width, flex: 1, backgroundColor: "white" },
  infoContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exerciseName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(20),
    color: "white",
    marginTop: height * 0.03,
  },
  exerciseDescription: {
    fontFamily: "Inter_400Regular",
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
