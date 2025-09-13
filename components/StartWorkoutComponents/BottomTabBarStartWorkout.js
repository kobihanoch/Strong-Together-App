import React, { useCallback, useRef, useState } from "react";
import Row from "../Row";
import Timer from "../Timer";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Column from "../Column";
import { colors } from "../../constants/colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const BottomTabBarStartWorkout = ({ exercises, startTime }) => {
  const workoutName = exercises?.[0]?.workoutsplit;
  const exerciseCount = exercises.length;

  return (
    <Row style={styles.container}>
      <Column style={styles.section}>
        <Timer style={styles.timerContainer} startTime={startTime} />
        <Text style={styles.sectionHeader}>Time Elapsed</Text>
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "auto",
    height: height * 0.15,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "flex-end",
    paddingBottom: height * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "100%",
    justifyContent: "center",
  },
  timerContainer: {
    fontSize: RFValue(18),
    fontFamily: "Inter_600SemiBold",
  },
  section: {
    justifyContent: "center",
    alignItems: "center",
  },
  sectionData: {
    fontSize: RFValue(18),
    fontFamily: "Inter_600SemiBold",
    color: "black",
  },
  sectionHeader: {
    fontSize: RFValue(12),
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
  },
});
export default BottomTabBarStartWorkout;
