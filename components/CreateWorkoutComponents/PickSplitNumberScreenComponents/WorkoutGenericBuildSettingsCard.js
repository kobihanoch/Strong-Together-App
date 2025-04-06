import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

function WorkoutGenericBuildSettingsCard({ setSplitsNumber }) {
  const [splits, setSplits] = useState(1);
  const updateSplits = (newSplits) => {
    setSplits(newSplits);
    setSplitsNumber(newSplits);
  };

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        borderRadius: width * 0.09,
        justifyContent: "center",
        alignItems: "center",
        gap: height * 0.04,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "column", gap: height * 0.02 }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(15),
            color: "#0d2540",
            textAlign: "center",
          }}
        >
          How many workout splits do you want?
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignItems: "center",
          gap: width * 0.08,
        }}
      >
        <TouchableOpacity onPress={() => updateSplits(Math.max(1, splits - 1))}>
          <FontAwesome5
            name="minus"
            size={RFValue(35)}
            color={"#2979FF"}
          ></FontAwesome5>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: RFValue(30),
            fontFamily: "Inter_700Bold",
            width: width * 0.05,
            color: "#2979FF",
          }}
        >
          {splits}
        </Text>
        <TouchableOpacity onPress={() => updateSplits(Math.min(6, splits + 1))}>
          <FontAwesome5
            name="plus"
            size={RFValue(35)}
            color={"#2979FF"}
          ></FontAwesome5>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default WorkoutGenericBuildSettingsCard;
