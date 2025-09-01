import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Card from "../AnalyticsComponents.js/Card";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { formatDate } from "../../utils/statisticsUtils";

const { width, height } = Dimensions.get("window");

function PRCard({ hasAssignedWorkout, PR }) {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "column", gap: 10 }}>
        <Text style={styles.header}>Personal Record</Text>
        <View style={styles.insideContainer}>
          <View style={{ flexDirection: "column", gap: 10, flex: 5 }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MaterialCommunityIcons
                  name={"dumbbell"}
                  size={RFValue(12)}
                  backgroundColor={"#12c282ff"}
                  paddingHorizontal={7}
                  paddingVertical={7}
                  borderRadius={10}
                  color={"white"}
                ></MaterialCommunityIcons>
                <Text style={styles.cardHeader}>Exercise</Text>
              </View>
              <Text
                style={[
                  styles.maxEntity,
                  { fontSize: RFValue(12), marginTop: 15 },
                ]}
              >
                {PR?.maxExercise}
              </Text>
            </View>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MaterialCommunityIcons
                  name={"calendar"}
                  size={RFValue(12)}
                  backgroundColor={"#06B6D4"}
                  paddingHorizontal={7}
                  paddingVertical={7}
                  borderRadius={10}
                  color={"white"}
                ></MaterialCommunityIcons>
                <Text style={styles.cardHeader}>Date</Text>
              </View>
              <Text
                style={[
                  styles.maxEntity,
                  { fontSize: RFValue(12), marginTop: 15 },
                ]}
              >
                {formatDate(PR?.maxDate)}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "column", gap: 10, flex: 5 }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MaterialCommunityIcons
                  name={"weight"}
                  size={RFValue(12)}
                  backgroundColor={"#ff2979"}
                  paddingHorizontal={7}
                  paddingVertical={7}
                  borderRadius={10}
                  color={"white"}
                ></MaterialCommunityIcons>
                <Text style={styles.cardHeader}>Weight</Text>
              </View>
              <Text
                style={[
                  styles.maxEntity,
                  { fontSize: RFValue(16), marginTop: 15 },
                ]}
              >
                {PR?.maxWeight}{" "}
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: RFValue(12),
                    opacity: 0.5,
                  }}
                >
                  Kg
                </Text>
              </Text>
            </View>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <MaterialCommunityIcons
                  name={"fire"}
                  size={RFValue(12)}
                  backgroundColor={"#ffaf29"}
                  paddingHorizontal={7}
                  paddingVertical={7}
                  borderRadius={10}
                  color={"white"}
                ></MaterialCommunityIcons>
                <Text style={styles.cardHeader}>Reps</Text>
              </View>
              <Text
                style={[
                  styles.maxEntity,
                  { fontSize: RFValue(16), marginTop: 15 },
                ]}
              >
                {PR?.maxReps}
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: RFValue(12),
                    opacity: 0.5,
                  }}
                >
                  {" "}
                  Times
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 15,
  },
  container: {
    alignSelf: "center",
    width: "90%",
    paddingVertical: height * 0.03,
    paddingHorizontal: height * 0.02,
    alignItems: "flex-start",
    borderRadius: 15,
    flexDirection: "column",
    backgroundColor: "#f4f8ffff",
    gap: 10,
  },
  insideContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    flexDirection: "column",
    height: height * 0.12,
    justifyContent: "space-between",
  },
  header: {
    fontFamily: "Inter_600SemiBold",
    color: "black",
    fontSize: RFValue(15),
    flex: 2,
    marginBottom: 10,
  },
  cardHeader: {
    fontFamily: "Inter_500Medium",
    color: "black",
    fontSize: RFValue(12),
  },
  maxEntity: {
    fontFamily: "Inter_500Medium",
    color: "black",
    fontSize: RFValue(12),
  },
});

export default PRCard;
