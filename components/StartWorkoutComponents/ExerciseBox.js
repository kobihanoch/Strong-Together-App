import React, { useState, useRef, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const ExerciseBox = ({ item, index, exerciseCount }) => {
  const [selected, setSelected] = useState(10);
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
          {item.sets &&
            item.sets.length > 0 &&
            item.sets.map((set) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: width * 0.02,
                  marginHorizontal: width * 0.02,
                  flex: 1,
                }}
              >
                <TextInput
                  style={{
                    backgroundColor: "red",
                    flex: 5,
                    height: "80%",
                  }}
                ></TextInput>
                <TextInput
                  style={{
                    backgroundColor: "black",
                    flex: 5,
                    height: "80%",
                  }}
                ></TextInput>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

export default ExerciseBox;
