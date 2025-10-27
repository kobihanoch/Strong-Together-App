import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { use } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCardioContext } from "../../context/CardioContext";

const { width, height } = Dimensions.get("window");

const StartCardioButton = ({ openCardioModal }) => {
  const navigation = useNavigation();
  const { hasDoneCardioToday = false } = useCardioContext() || {};
  return (
    <TouchableOpacity
      style={styles.cta}
      onPress={() => openCardioModal(hasDoneCardioToday ? 0 : 1)}
    >
      <Text style={styles.ctaText}>{"Log daily cardio"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // CTA
  cta: {
    backgroundColor: "transparent",
    height: height * 0.065,
    borderRadius: height * 0.02,
    borderColor: "white",
    borderWidth: 0.2,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(14.5),
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});

export default StartCardioButton;
