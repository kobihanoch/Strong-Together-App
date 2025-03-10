import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import images from "../../images";

const { width, height } = Dimensions.get("window");

const PickExerciseItem = ({ exercise, onSelectExercise, isSelected }) => {
  const mainMuscle = exercise.targetmuscle;
  const specificMuscle = exercise.specifictargetmuscle;
  const imagePath = images[mainMuscle]?.[specificMuscle];

  return (
    <TouchableOpacity
      onPress={() => onSelectExercise(exercise)}
      style={[
        styles.exerciseContainer,
        isSelected && { borderColor: "#0d2540", borderWidth: 2 },
      ]}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.4, justifyContent: "center" }}>
          <LinearGradient
            colors={["#00142a", "#0d2540"]}
            style={styles.imageContainer}
          >
            <Image source={imagePath} style={styles.exerciseImage} />
          </LinearGradient>
        </View>

        <View style={styles.exerciseInfoContainer}>
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.muscleText}>
              {exercise.targetmuscle}, {exercise.specifictargetmuscle}
            </Text>
            <Text style={styles.placeholderText}>None</Text>
          </View>
        </View>

        <View
          style={{
            flex: 0.1,
            margin: width * 0.04,
            alignItems: "center",
          }}
        >
          <FontAwesome5
            name={isSelected ? "check-circle" : "info-circle"}
            size={18}
            color={isSelected ? "#0d2540" : "#00142a"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "#fafafa",
    width: "100%",
    alignSelf: "center",
    height: height * 0.14,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
    borderColor: "transparent",
    borderWidth: 2,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: width * 0.02,
    borderWidth: 2,
    borderColor: "#666d75",
  },
  exerciseImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    opacity: 0.8,
  },
  exerciseInfoContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: width * 0.05,
  },
  exerciseName: {
    fontFamily: "PoppinsBold",
    fontSize: RFValue(13),
    color: "black",
    width: "100%",
  },
  muscleText: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(12),
    color: "#919191",
  },
  placeholderText: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(12),
    color: "black",
    opacity: 0.7,
    marginTop: height * 0.01,
  },
});

export default PickExerciseItem;
