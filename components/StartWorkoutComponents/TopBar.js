import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Column from "../Column";
import Timer from "../Timer";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import Row from "../Row";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdherenceBar } from "../AdherenceBar";
import { colors } from "../../constants/colors";

const { height, width } = Dimensions.get("window");

const TopBar = ({
  workoutName,
  totalSets,
  setsDone,
  timerProps,
  saveWorkout,
  onExit,
}) => {
  return (
    <Column style={styles.container}>
      <Row style={{ gap: 25, alignItems: "center" }}>
        <View>
          <LinearGradient
            colors={["#2979FF", "#2979FF"]}
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name={"dumbbell"}
              size={RFValue(15)}
              color={"white"}
            />
          </LinearGradient>
        </View>
        <Column style={{ gap: 3 }}>
          <Text style={styles.workoutHeader}>Workout {workoutName}</Text>
          <Row style={{ gap: 15 }}>
            <Row style={{ gap: 4 }}>
              <MaterialCommunityIcons
                name={"chart-timeline-variant-shimmer"}
                size={RFValue(15)}
                color={"black"}
              />
              <Text style={styles.progressHeader}>
                {Math.round((setsDone / totalSets) * 100) + "%"}
              </Text>
            </Row>
            <Row style={{ gap: 4 }}>
              <MaterialCommunityIcons
                name={"timer"}
                size={RFValue(14)}
                color={"black"}
              />
              <Timer
                style={styles.timerContainer}
                startTime={timerProps?.startTime}
                pausedTotal={timerProps?.pausedTotal}
              />
            </Row>
          </Row>
        </Column>
        <Column style={{ marginLeft: "auto", gap: 10 }}>
          <TouchableOpacity style={styles.finishBtn} onPress={saveWorkout}>
            <Text style={styles.finishBtnText}>Finish</Text>
            <MaterialCommunityIcons
              name={"check"}
              size={RFValue(12)}
              color={"white"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
            <Text style={styles.exitBtnText}>Exit</Text>
            <MaterialCommunityIcons
              name={"exit-to-app"}
              size={RFValue(12)}
              color={colors.primary}
            />
          </TouchableOpacity>
        </Column>
      </Row>
      <AdherenceBar
        actual={setsDone}
        planned={totalSets}
        showPct={false}
        colorStatic={colors.primary}
        changeColors={false}
      ></AdherenceBar>
      <Text style={styles.workoutCompletionText}>
        {Math.round((setsDone / totalSets) * 100) + "%"} Completed
      </Text>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.28,
    justifyContent: "flex-end",
    backgroundColor: colors.lightCardBg,
    paddingBlock: 20,
    paddingHorizontal: 20,
  },
  timerContainer: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
  },
  iconContainer: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
    padding: 15,
  },
  flameContainer: {
    position: "absolute",
    top: -3,
    right: -3,
    padding: 2,
    borderRadius: 20,
    backgroundColor: "#ffaf29",
    justifyContent: "center",
    alignItems: "center",
  },
  workoutHeader: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(18),
  },
  progressHeader: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
  },
  finishBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#2979FF",
    flexDirection: "row",
    gap: 7,
  },
  finishBtnText: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },
  exitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: "row",
    gap: 7,
  },
  exitBtnText: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
    color: colors.primary,
  },
  workoutCompletionText: {
    fontSize: RFValue(11),
    fontFamily: "Inter_400Regular",
    color: colors.primary,
    marginTop: 7,
  },
});

export default TopBar;
