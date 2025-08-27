import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const LastWorkoutData = ({ lastWorkoutData, setIndex }) => {
  const displayValue = (value) =>
    value === undefined || value === null ? "Not recorded" : value;

  return (
    <View>
      {lastWorkoutData?.reps[setIndex] ? (
        <View style={styles.contentContainer}>
          <Text style={styles.exerciseName}>{lastWorkoutData.exercise}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>
              {displayValue(lastWorkoutData?.weight?.[setIndex])} kg
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Reps</Text>
            <Text style={styles.value}>
              {displayValue(lastWorkoutData?.reps?.[setIndex])}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(lastWorkoutData?.workoutdate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTextTitle}>No previous data found</Text>
          <Text style={styles.emptyTextSubtitle}>
            Once you complete a set for this exercise, it will appear here.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000088",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: RFValue(20),
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    color: "#1f2937",
    marginBottom: 16,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  exerciseName: {
    fontSize: RFValue(17),
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    color: "#111827",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
  },
  label: {
    fontSize: RFValue(14),
    fontFamily: "Inter_400Regular",
    color: "#6b7280",
  },
  value: {
    fontSize: RFValue(14),
    fontFamily: "Inter_600SemiBold",
    color: "#1f2937",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyTextTitle: {
    fontSize: RFValue(16),
    fontFamily: "Inter_600SemiBold",
    color: "#6b7280",
  },
  emptyTextSubtitle: {
    fontSize: RFValue(13),
    fontFamily: "Inter_400Regular",
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 4,
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderRadius: 18,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: RFValue(15),
    fontFamily: "Inter_600SemiBold",
  },
});

export default LastWorkoutData;
