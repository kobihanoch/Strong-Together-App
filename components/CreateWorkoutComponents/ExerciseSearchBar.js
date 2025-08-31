import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
const ExerciseSearchBar = ({ search, query }) => {
  return (
    <View
      style={{
        width: "70%",
        height: height * 0.05,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        marginVertical: 10,
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        overflow: "hidden",
      }}
    >
      <MaterialCommunityIcons
        name={"magnify"}
        size={25}
        color={"rgba(107, 107, 107, 1)"}
      />
      <TextInput
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: RFValue(12),
          flex: 1,
          marginLeft: 5,
        }}
        value={query}
        onChangeText={search}
        placeholder="Search exercises..."
      ></TextInput>
    </View>
  );
};

export default ExerciseSearchBar;
