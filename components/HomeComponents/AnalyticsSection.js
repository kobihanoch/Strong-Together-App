import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const AnalyticsSection = () => {
  const navigate = useNavigation();
  return (
    <View
      style={{
        height: height * 0.06,
        borderRadius: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: RFValue(12),
          color: "black",
        }}
      >
        Check out your workout analytics
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "#2979FF",
          padding: 5,
          borderRadius: 10,
          width: 50,
          alignItems: "center",
        }}
        onPress={() => navigate.navigate("Analytics")}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          color="white"
          size={RFValue(15)}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AnalyticsSection;
