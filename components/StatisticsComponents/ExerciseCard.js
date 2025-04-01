import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import images from "../../components/images";
import { formatDate, isSetPR } from "../../utils/statisticsUtils";

const { width, height } = Dimensions.get("window");

const ExerciseCard = ({ item, dataToCompare, exerciseTracking }) => {
  const previousExercise = Array.isArray(dataToCompare)
    ? dataToCompare.find((prev) => prev.exercise_id == item.exercise_id)
    : null;
  //console.log(JSON.stringify(previousExercise));
  const mainMuscle = item.exercisetoworkoutsplit.exercises.targetmuscle;
  const specificMuscle =
    item.exercisetoworkoutsplit.exercises.specifictargetmuscle;

  const imagePath = images[mainMuscle]?.[specificMuscle];

  return (
    <LinearGradient
      colors={["rgb(238, 245, 255)", "rgb(231, 233, 236)"]}
      style={styles.item}
    >
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          alignItems: "center",
          marginTop: -height * 0.01,
        }}
      >
        <View style={{ flex: 7 }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: RFValue(17),
            }}
          >
            {item.exercise}
          </Text>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: RFValue(10),
              opacity: 0.4,
            }}
          >
            {formatDate(item.workoutdate)}
          </Text>
        </View>
        <LinearGradient
          colors={["#00142a", "#0d2540"]}
          style={{
            flex: 3,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            margin: width * 0.02,
            borderWidth: 2,
            borderColor: "#666d75",
            height: "100%",
            opacity: 0.9,
            marginRight: -width * 0.01,
          }}
        >
          <View>
            <Image
              source={imagePath}
              style={{
                height: 50,
                width: 50,
                resizeMode: "contain",
                opacity: 0.8,
              }}
            />
          </View>
        </LinearGradient>
      </View>

      <View style={{ flexDirection: "column", flex: 8, gap: height * 0.03 }}>
        <View style={{ flex: 5, flexDirection: "column", gap: height * 0.01 }}>
          <View>
            <Text
              style={{ fontFamily: "Inter_700Bold", fontSize: RFValue(12) }}
            >
              Current workout
            </Text>
          </View>
          {/* Current Workout */}
          <View
            style={{
              flexDirection: "row",
              gap: width * 0.02,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: "rgba(157, 157, 157, 0)",
              borderRadius: height * 0.02,
            }}
          >
            {item.weight.map((w, index) => {
              const prevWeight = previousExercise?.weight?.[index];
              const isImproved = prevWeight !== undefined && w > prevWeight;
              const isPr = isSetPR(exerciseTracking, w);
              const color = isPr
                ? "rgb(170, 122, 2)"
                : prevWeight === undefined
                ? "black"
                : isImproved
                ? "rgb(13, 177, 54)"
                : "rgb(177, 13, 13)";
              const backgroundColor = isPr
                ? "rgba(255, 183, 0, 0.07)"
                : prevWeight === undefined
                ? "rgba(219, 219, 219, 0.1)"
                : isImproved
                ? "rgba(13, 177, 54, 0.07)"
                : "rgba(177, 13, 13, 0.07)";

              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: width * 0.02,
                    height: "100%",
                    paddingVertical: height * 0.02,
                    paddingHorizontal: height * 0.01,
                    width: width * 0.22,
                    backgroundColor,
                    borderRadius: height * 0.02,
                    //borderRightWidth: index < item.weight.length - 1 ? 1 : 0,
                    //borderColor: "rgba(116, 116, 116, 0.31)",
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: RFValue(12),
                        color,
                      }}
                    >
                      {w} kg
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: RFValue(12),
                        color,
                      }}
                    >
                      {item.reps[index]} reps
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        fontSize: RFValue(13),
                        color,
                      }}
                    >
                      Set {index + 1}
                    </Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {isPr ? (
                      <Text style={{ fontFamily: "Inter_700Bold", color }}>
                        PR
                      </Text>
                    ) : prevWeight ? (
                      isImproved ? (
                        <FontAwesome5
                          name="arrow-up"
                          color={color}
                        ></FontAwesome5>
                      ) : (
                        <FontAwesome5
                          name="arrow-down"
                          color={color}
                        ></FontAwesome5>
                      )
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View
          style={{
            flex: 5,
            flexDirection: "column",
            gap: height * 0.02,
            backgroundColor: "rgba(3, 95, 255, 0.13)",
            borderRadius: height * 0.02,
            padding: height * 0.02,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{ fontFamily: "Inter_700Bold", fontSize: RFValue(12) }}
            >
              In compare to
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(10),
              }}
            >
              {previousExercise
                ? previousExercise.isLastWorkout
                  ? "Last workout"
                  : formatDate(previousExercise.workoutdate)
                : ""}
            </Text>
          </View>
          {/* Prev Workout */}
          {previousExercise ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: "rgba(157, 157, 157, 0)",
                borderRadius: height * 0.02,
                opacity: 0.3,
              }}
            >
              {previousExercise.weight.map((w, index) => (
                <View
                  key={`prev-${index}`}
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: height * 0.02,
                    width: width * 0.2,
                    backgroundColor: "rgba(219, 219, 219, 0.07)",
                    borderRadius: height * 0.02,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: RFValue(12),
                      color: "black",
                    }}
                  >
                    {w} kg
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      fontSize: RFValue(12),
                      color: "black",
                    }}
                  >
                    {previousExercise.reps[index]} reps
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      fontSize: RFValue(13),
                      color: "black",
                    }}
                  >
                    Set {index + 1}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: RFValue(13),
                  color: "black",
                  opacity: 0.5,
                }}
              >
                No earlier data
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  item: {
    marginRight: width * 0.05,
    width: width * 0.8,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    gap: height * 0.02,
    borderRadius: height * 0.02,
  },
});

export default ExerciseCard;
