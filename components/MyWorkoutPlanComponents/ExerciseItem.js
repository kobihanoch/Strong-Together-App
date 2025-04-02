import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import images from "../../components/images";

const { width, height } = Dimensions.get("window");

const ExerciseItem = ({ exercise }) => {
  const mainMuscle = exercise.targetmuscle;
  const specificMuscle = exercise.specifictargetmuscle;

  const imagePath = images[mainMuscle]?.[specificMuscle];

  return (
    <View style={styles.exerciseContainer}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.4, justifyContent: "center" }}>
          <View
            /*colors={["#00142a", "#0d2540"]}*/
            style={{
              flex: 1,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              margin: width * 0.02,
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
          </View>
        </View>
        <View
          style={{
            flex: 0.6,
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: width * 0.05,
          }}
        >
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: RFValue(13),
                color: "black",
              }}
            >
              {exercise.exercise}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(12),
                color: "#919191",
              }}
            >
              {exercise.targetmuscle}, {exercise.specifictargetmuscle}
            </Text>

            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(12),
                color: "black",
                opacity: 0.7,
                marginTop: height * 0.01,
              }}
            >
              Reps per set
            </Text>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: RFValue(12),
                color: "black",
                opacity: 0.7,
              }}
            >
              {Array.isArray(exercise.sets)
                ? exercise.sets.join(" / ")
                : exercise.sets
                ? exercise.sets.split(",").join(" ")
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    height: height * 0.14,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
  },
});

export default ExerciseItem;
