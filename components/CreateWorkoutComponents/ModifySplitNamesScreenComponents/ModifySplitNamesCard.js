// ModifySplitNamesCard.js - Displays split names and their selected exercise counts
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

function ModifySplitNamesCard({
  splitsNumber,
  setEditWorkoutSplitName,
  setStep,
  selectedExercisesBySplit,
}) {
  const splitNames = Array.from({ length: splitsNumber }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        borderRadius: width * 0.09,
        justifyContent: "center",
        alignItems: "center",
        gap: height * 0.04,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: "transparent",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={splitNames}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const exercisesCount = selectedExercisesBySplit[item]?.length || 0;

          return (
            <View
              style={{
                flexDirection: "row",
                borderRadius: height * 0.02,

                backgroundColor: "#2979FF",
                width: "98%",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: height * 0.01,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  paddingLeft: width * 0.04,
                  alignItems: "center",
                  gap: width * 0.2,
                  elevation: 4,
                  height: height * 0.1,
                  backgroundColor: "white",
                  borderRadius: height * 0.02,
                  flex: 6,
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      fontFamily: "Inter_700Bold",
                      color: "black",
                      fontSize: RFValue(30),
                    }}
                  >
                    {item}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Inter_400Regular",
                      color: "black",
                      fontSize: RFValue(10),
                    }}
                  >
                    {exercisesCount > 0
                      ? `${exercisesCount} exercises selected`
                      : "No exercises"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  flex: 4,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: height * 0.01,
                }}
                onPress={() => {
                  setEditWorkoutSplitName(item);
                  setStep(3);
                }}
              >
                <View>
                  <FontAwesome5
                    name="plus-circle"
                    size={RFValue(15)}
                    color={"white"}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: RFValue(10),
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Add exercises
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

export default ModifySplitNamesCard;
