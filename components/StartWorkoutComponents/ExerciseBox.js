import js from "@eslint/js";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import ProgressBar from "./ProgressBar";

const { width, height } = Dimensions.get("window");

const ExerciseBox = ({ item, index, exerciseCount }) => {
  const [visibleSetIndex, setVisibleSetIndex] = useState(0);
  const [repsArray, setRepsArray] = useState(() =>
    Array(item.sets.length).fill(0)
  );
  const [weightsArray, setWeightsArray] = useState(() =>
    Array(item.sets.length).fill(0)
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log(
      "Set (" + visibleSetIndex + "): Reps array " + JSON.stringify(repsArray)
    );
    setProgress((repsArray[visibleSetIndex] / item.sets[visibleSetIndex]) * 10);
  }, [repsArray, visibleSetIndex]);
  useEffect(() => {
    console.log(
      "Set (" +
        visibleSetIndex +
        "): Weights array " +
        JSON.stringify(weightsArray)
    );
  }, [weightsArray]);

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        alignItems: "center",
        width: width,
        flexDirection: "column",
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: RFValue(25),
          color: "black",
          marginTop: height * 0.04,
        }}
      >
        {item.exercise}
      </Text>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: RFValue(15),
          color: "rgb(163, 163, 163)",
          marginTop: height * 0.01,
        }}
      >
        Exercise {index + 1} of {exerciseCount}
      </Text>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          alignSelf: "center",
          width: "80%",
          marginTop: height * 0.02,
          borderRadius: height * 0.04,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 1,
        }}
      >
        <View
          style={{
            height: "90%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item.sets && item.sets.length > 0 && (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: width * 0.02,
                width: "100%",
                flex: 1,
                paddingTop: height * 0.04,
                paddingHorizontal: width * 0.07,
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18),
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                Set {visibleSetIndex + 1} of {item.sets.length}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(14),
                  fontFamily: "Inter_600SemiBold",
                  color: "rgb(130, 130, 130)",
                }}
              >
                Target: {item.sets[visibleSetIndex]} reps
              </Text>

              <View
                style={{
                  flex: 8,
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 3.5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(15),
                      fontFamily: "Inter_600SemiBold",
                      flex: 5,
                    }}
                  >
                    Weight
                  </Text>
                  <TextInput
                    style={{
                      flex: 5,
                      backgroundColor: "rgb(234, 240, 246)",
                      height: "60%",
                      borderRadius: height * 0.02,
                      textAlign: "center",
                      fontSize: RFValue(15),
                      fontFamily: "Inter_400Regular",
                    }}
                    value={weightsArray[visibleSetIndex].toString()}
                    onChangeText={(text) => {
                      const arrDup = [...weightsArray];
                      arrDup[visibleSetIndex] =
                        text === "" ? 0 : parseInt(text);
                      setWeightsArray(arrDup);
                    }}
                    keyboardType="numeric"
                    inputMode="numeric"
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 3.5,
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(15),
                      fontFamily: "Inter_600SemiBold",
                      flex: 5,
                    }}
                  >
                    Reps
                  </Text>
                  <TextInput
                    style={{
                      flex: 5,
                      backgroundColor: "rgb(234, 240, 246)",
                      height: "60%",
                      borderRadius: height * 0.02,
                      textAlign: "center",
                      fontSize: RFValue(15),
                      fontFamily: "Inter_400Regular",
                    }}
                    value={repsArray[visibleSetIndex].toString()}
                    keyboardType="numeric"
                    inputMode="numeric"
                    onChangeText={(text) => {
                      const arrDup = [...repsArray];
                      arrDup[visibleSetIndex] =
                        text === "" ? 0 : parseInt(text);
                      setRepsArray(arrDup);
                    }}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flex: 3,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ProgressBar progress={progress}></ProgressBar>
                </View>
              </View>
              <View
                style={{
                  flex: 2,
                  width: "100%",
                  flexDirection: "row",
                  gap: width * 0.02,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 2,
                    width: "100%",
                    backgroundColor: "#2979FF",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: visibleSetIndex == 0 ? 0 : 1,
                    borderRadius: height * 0.02,
                  }}
                  onPress={() => {
                    setVisibleSetIndex(visibleSetIndex - 1);
                  }}
                  disabled={visibleSetIndex == 0}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      color: "white",
                      fontSize: RFValue(13),
                    }}
                  >
                    Previous Set
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 2,
                    width: "100%",
                    backgroundColor: "#2979FF",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity:
                      (visibleSetIndex == item.sets.length - 1 &&
                        weightsArray[visibleSetIndex] == 0) ||
                      repsArray[visibleSetIndex] == 0
                        ? 0
                        : 1,
                    borderRadius: height * 0.02,
                  }}
                  onPress={() => {
                    setVisibleSetIndex(visibleSetIndex + 1);
                  }}
                  disabled={visibleSetIndex == item.sets.length - 1}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      color: "white",
                      fontSize: RFValue(13),
                    }}
                  >
                    Next Set
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ExerciseBox;
