import React, { forwardRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
// Adjust this import path to where your SlidingBottomModal lives

const { width, height } = Dimensions.get("window");

const ExercisePickerModal = forwardRef(function ExercisePickerModal(
  { selectedSplit, controls },
  ref
) {
  return <View></View>;
});

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(15),
    color: "#1A1A1A",
    opacity: 0.9,
  },
  card: {
    backgroundColor: "rgb(234, 240, 246)",
    borderRadius: width * 0.035,
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.012,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2979FF",
    marginRight: 10,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(13),
    color: "#111",
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(11),
    color: "#58606A",
  },
  choosePill: {
    backgroundColor: "#2979FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chooseText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(11),
  },
  tabBtn: {
    borderRadius: width * 0.025,
    marginHorizontal: width * 0.012,
    paddingHorizontal: 14,
    minWidth: width * 0.22,
    height: Math.max(38, height * 0.046),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
  },
});

export default ExercisePickerModal;
