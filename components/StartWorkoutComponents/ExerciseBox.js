import js from "@eslint/js";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import ProgressBar from "./ProgressBar";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import BottomModal from "../BottomModal";

const { width, height } = Dimensions.get("window");

const ExerciseBox = ({
  item,
  index,
  exerciseCount,
  onScrollNext,
  weightArrs,
  repsArrs,
  updateWeightArrs,
  updateRepsArrs,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visibleSetIndex, setVisibleSetIndex] = useState(0);
  const [repsArray, setRepsArray] = useState(() =>
    Array(item.sets.length).fill(0)
  );
  const [weightsArray, setWeightsArray] = useState(() =>
    Array(item.sets.length).fill(0)
  );
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress((repsArray[visibleSetIndex] / item.sets[visibleSetIndex]) * 10);
  }, [repsArray, visibleSetIndex]);

  useEffect(() => {
    const weightDup = [...weightArrs];
    weightDup[index] = [...weightsArray];
    updateWeightArrs(weightDup);
  }, [weightsArray]);

  useEffect(() => {
    const repsDup = [...repsArrs];
    repsDup[index] = [...repsArray];
    updateRepsArrs(repsDup);
  }, [repsArray]);

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
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: width * 0.02,
                width: "100%",
                flex: 1,
                paddingTop: height * 0.04,
                paddingHorizontal: width * 0.07,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "column", gap: height * 0.01 }}>
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
                      fontFamily: "Inter_400Regular",
                      fontSize: RFValue(12),
                      backgroundColor: "rgb(234, 240, 246)",
                      borderRadius: height * 0.01,
                      paddingHorizontal: width * 0.03,
                      paddingVertical: height * 0.005,
                      textAlign: "center",
                      color: "#2563eb",
                    }}
                  >
                    Target: {item.sets[visibleSetIndex]} reps
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <MaterialCommunityIcons
                    name="history"
                    size={RFValue(25)}
                    color="#2563eb"
                  />
                </TouchableOpacity>
                <BottomModal
                  isVisible={isModalVisible}
                  onClose={() => setIsModalVisible(false)}
                  exerciseId={item.id}
                  setIndex={visibleSetIndex}
                />
              </View>

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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 5,
                      height: "60%",
                      borderWidth: 2,
                      borderColor: "rgb(231, 231, 231)",
                      borderRadius: height * 0.008,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        const arrDup = [...weightsArray];
                        const current =
                          parseFloat(arrDup[visibleSetIndex]) || 0;
                        arrDup[visibleSetIndex] = Math.max(0, current - 2.5);
                        setWeightsArray(arrDup);
                      }}
                      style={{
                        backgroundColor: "rgb(234, 240, 246)",
                        paddingHorizontal: width * 0.03,
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        borderTopLeftRadius: height * 0.008,
                        borderBottomLeftRadius: height * 0.008,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(20),
                          color: "#2563eb",
                          fontFamily: "Inter_600SemiBold",
                        }}
                      >
                        -
                      </Text>
                    </TouchableOpacity>

                    <TextInput
                      style={{
                        flex: 1,
                        backgroundColor: "white",
                        height: "90%",
                        textAlign: "center",
                        fontSize: RFValue(15),
                        fontFamily: "Inter_400Regular",
                        paddingHorizontal: 5,
                      }}
                      value={weightsArray[visibleSetIndex].toString()}
                      onChangeText={(text) => {
                        const arrDup = [...weightsArray];
                        const cleaned = text.replace(/[^0-9.]/g, "");
                        arrDup[visibleSetIndex] =
                          cleaned === "" ? 0 : parseFloat(cleaned);
                        setWeightsArray(arrDup);
                      }}
                      keyboardType="numeric"
                      inputMode="numeric"
                    />

                    <TouchableOpacity
                      onPress={() => {
                        const arrDup = [...weightsArray];
                        const current =
                          parseFloat(arrDup[visibleSetIndex]) || 0;
                        arrDup[visibleSetIndex] = current + 2.5;
                        setWeightsArray(arrDup);
                      }}
                      style={{
                        backgroundColor: "rgb(234, 240, 246)",
                        paddingHorizontal: width * 0.03,
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        borderTopRightRadius: height * 0.008,
                        borderBottomRightRadius: height * 0.008,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(20),
                          color: "#2563eb",
                          fontFamily: "Inter_600SemiBold",
                        }}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 5,
                      height: "60%",
                      borderWidth: 2,
                      borderColor: "rgb(231, 231, 231)",
                      borderRadius: height * 0.008,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        const arrDup = [...repsArray];
                        const current = parseInt(arrDup[visibleSetIndex]) || 0;
                        arrDup[visibleSetIndex] = Math.max(0, current - 1);
                        setRepsArray(arrDup);
                      }}
                      style={{
                        backgroundColor: "rgb(234, 240, 246)",
                        paddingHorizontal: width * 0.03,
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        borderTopLeftRadius: height * 0.008,
                        borderBottomLeftRadius: height * 0.008,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(20),
                          color: "#2563eb",
                          fontFamily: "Inter_600SemiBold",
                        }}
                      >
                        -
                      </Text>
                    </TouchableOpacity>

                    <TextInput
                      style={{
                        flex: 1,
                        backgroundColor: "white",
                        height: "90%",
                        textAlign: "center",
                        fontSize: RFValue(15),
                        fontFamily: "Inter_400Regular",
                        paddingHorizontal: 5,
                      }}
                      value={repsArray[visibleSetIndex].toString()}
                      keyboardType="numeric"
                      inputMode="numeric"
                      onChangeText={(text) => {
                        const arrDup = [...repsArray];
                        const cleaned = text.replace(/[^0-9]/g, "");
                        arrDup[visibleSetIndex] =
                          cleaned === "" ? 0 : parseInt(cleaned);
                        setRepsArray(arrDup);
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        const arrDup = [...repsArray];
                        const current = parseInt(arrDup[visibleSetIndex]) || 0;
                        arrDup[visibleSetIndex] = current + 1;
                        setRepsArray(arrDup);
                      }}
                      style={{
                        backgroundColor: "rgb(234, 240, 246)",
                        paddingHorizontal: width * 0.03,
                        aspectRatio: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        borderTopRightRadius: height * 0.008,
                        borderBottomRightRadius: height * 0.008,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(20),
                          color: "#2563eb",
                          fontFamily: "Inter_600SemiBold",
                        }}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flex: 3,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {repsArray[visibleSetIndex].toString() == "0" ? null : (
                    <ProgressBar progress={progress}></ProgressBar>
                  )}
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  flexDirection: "row",
                  gap: width * 0.02,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 2,
                    height: height * 0.05,
                    width: "100%",
                    borderColor: "#2979FF",
                    borderWidth: 2,
                    backgroundColor: "white",
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
                      color: "#2979FF",
                      fontSize: RFValue(13),
                    }}
                  >
                    Previous Set
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 2,
                    height: height * 0.05,
                    width: "100%",
                    backgroundColor:
                      visibleSetIndex == item.sets.length - 1
                        ? "#4cd964"
                        : "#2979FF",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity:
                      weightsArray[visibleSetIndex] !== 0 &&
                      repsArray[visibleSetIndex] !== 0 &&
                      !(
                        visibleSetIndex === item.sets.length - 1 &&
                        index === exerciseCount - 1
                      )
                        ? 1
                        : 0,
                    borderRadius: height * 0.02,
                  }}
                  onPress={() => {
                    if (visibleSetIndex < item.sets.length - 1) {
                      setVisibleSetIndex(visibleSetIndex + 1);
                    } else {
                      onScrollNext?.();
                    }
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      color: "white",
                      fontSize: RFValue(13),
                    }}
                  >
                    {visibleSetIndex == item.sets.length - 1
                      ? "Next Exercise"
                      : "Next Set"}
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
