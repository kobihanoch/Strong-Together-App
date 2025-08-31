import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import images from "../../components/images";
import { useTranslation } from "react-i18next";
import { slug, tExercise, tMuscle } from "../../utils/translationUtils";

const { width, height } = Dimensions.get("window");

const ExerciseItem = ({ exercise }) => {
  const { t } = useTranslation();

  // Use the correct DB fields
  const mainMuscle = exercise.targetmuscle;
  const specificMuscle = exercise.specifictargetmuscle;

  // Translate names with safe fallback to DB text
  const exName = tExercise(t, exercise.exercise);
  const mainName = tMuscle(t, mainMuscle);
  const specName = tMuscle(t, specificMuscle);

  // Keep image lookup based on original DB keys
  const imagePath = images[mainMuscle]?.[specificMuscle];

  return (
    <View style={styles.exerciseContainer}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.3, justifyContent: "center" }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: "70%",
                borderRadius: height * 0.02,
                aspectRatio: 1,
                backgroundColor: "rgb(234, 240, 246)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={imagePath}
                style={{
                  height: height * 0.06,
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
            flex: 0.7,
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
                alignSelf: "flex-start",
              }}
            >
              {exName}
            </Text>

            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(10),
                color: "#919191",
                alignSelf: "flex-start",
              }}
            >
              {mainName}, {specName}
            </Text>

            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: RFValue(10),
                color: "black",
                opacity: 0.7,
                alignSelf: "flex-start",
              }}
            >
              {Array.isArray(exercise.sets)
                ? exercise.sets.join(" / ")
                : exercise.sets
                ? exercise.sets.split(",").join(" ")
                : t("common.na")}
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
    height: height * 0.12,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
  },
});

export default ExerciseItem;
