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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                height: "60%",
                borderRadius: height * 0.08,
                aspectRatio: 1,
                backgroundColor: "rgb(234, 240, 246)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={imagePath}
                style={{
                  height: height * 0.04,
                  aspectRatio: 1,
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
                fontFamily: "Inter_600SemiBold",
                fontSize: RFValue(15),
                color: "black",
              }}
            >
              {exercise.exercise}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(10),
                color: "#919191",
              }}
            >
              {exercise.targetmuscle}, {exercise.specifictargetmuscle}
            </Text>

            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: RFValue(10),
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
    width: "95%",
    alignSelf: "center",
    height: height * 0.1,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
  },
});

export default ExerciseItem;
