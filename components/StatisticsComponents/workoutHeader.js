import React from "react";
import Row from "../Row";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Column from "../Column";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../constants/colors";
import { formatDate } from "../../utils/statisticsUtils";

const { width, height } = Dimensions.get("window");

const WorkoutHeader = ({ data, selectedDate }) => {
  return (
    <Row style={{ alignItems: "center", marginTop: 20, marginHorizontal: 10 }}>
      <View style={styles.capitalContainer}>
        <Text style={styles.capitalText}>{data ? data[0].splitname : "R"}</Text>
      </View>
      <Column>
        <Text style={styles.workoutTitle}>
          {data ? "Workout " + data[0].splitname : "Rest day"}
        </Text>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  workoutTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(15),
    color: "black",
    marginHorizontal: 10,
  },
  dateText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(11),
    color: colors.textSecondary,
    marginHorizontal: 10,
  },
  capitalContainer: {
    backgroundColor: colors.lightCardBg,
    height: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    aspectRatio: 1,
    marginLeft: 10,
  },
  capitalText: {
    color: "black",
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(17),
  },
});

export default WorkoutHeader;
