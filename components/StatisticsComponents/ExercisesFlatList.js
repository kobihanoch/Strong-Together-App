import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import images from "../../components/images";

const { width, height } = Dimensions.get("window");

const ExercisesFlatList = ({ data, dataToCompare }) => {
  const renderItem = ({ item }) => {
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
        colors={["rgb(255, 255, 255)", "rgb(216, 234, 255)"]}
        style={styles.item}
      >
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 7 }}>
            <Text
              style={{
                fontFamily: "PoppinsBold",
                fontSize: RFValue(17),
              }}
            >
              {item.exercise}
            </Text>

            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: RFValue(10),
                opacity: 0.4,
              }}
            >
              {item.workoutdate.split("-").reverse().join(".")}
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
              height: "80%",
              opacity: 0.9,
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

        <View style={{ flexDirection: "column", flex: 8 }}>
          <View
            style={{ flex: 4.5, flexDirection: "column", gap: height * 0.02 }}
          >
            <View>
              <Text
                style={{ fontFamily: "PoppinsBold", fontSize: RFValue(12) }}
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
                const color =
                  prevWeight === undefined
                    ? "black"
                    : isImproved
                    ? "green"
                    : "red";

                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: height * 0.01,
                      width: width * 0.2,
                      borderRightWidth: index < item.weight.length - 1 ? 1 : 0,
                      borderColor: "rgba(116, 116, 116, 0.31)",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(15),
                        color,
                      }}
                    >
                      {w} kg
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(15),
                        color,
                      }}
                    >
                      {item.reps[index]} reps
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsBold",
                        fontSize: RFValue(15),
                        color,
                      }}
                    >
                      Set {index + 1}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                borderTopColor: "black",
                borderTopWidth: 1,
              }}
            >
              <Text></Text>
            </View>
          </View>
          <View
            style={{
              flex: 4.5,
              flexDirection: "column",
              gap: height * 0.02,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{ fontFamily: "PoppinsBold", fontSize: RFValue(12) }}
              >
                In compare to
              </Text>
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  fontSize: RFValue(10),
                }}
              >
                {previousExercise
                  ? previousExercise.isLastWorkout
                    ? "Last workout"
                    : previousExercise.workoutdate
                        .split("-")
                        .reverse()
                        .join(".")
                  : ""}
              </Text>
            </View>
            {/* Prev Workout */}
            {previousExercise ? (
              <View
                style={{
                  flexDirection: "row",
                  gap: width * 0.02,
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
                      padding: height * 0.01,
                      width: width * 0.2,
                      borderRightWidth:
                        index < previousExercise.weight.length - 1 ? 1 : 0,
                      borderColor: "rgba(116, 116, 116, 0.31)",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(15),
                        color: "black",
                      }}
                    >
                      {w} kg
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(15),
                        color: "black",
                      }}
                    >
                      {previousExercise.reps[index]} reps
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsBold",
                        fontSize: RFValue(15),
                        color: "black",
                      }}
                    >
                      Set {index + 1}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: RFValue(13),
                    color: "black",
                    alignSelf: "center",
                  }}
                >
                  Not tracked last workout
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={{ flex: 7, justifyContent: "center", alignItems: "center" }}>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      ) : (
        <Text
          style={{
            fontFamily: "PoppinsBold",
            color: "white",
            fontSize: RFValue(18),
          }}
        >
          REST DAY
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginRight: width * 0.05,
    backgroundColor: "#f5f5f5",
    width: width * 0.75,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    gap: height * 0.02,
    borderRadius: height * 0.02,
  },
});

export default ExercisesFlatList;
