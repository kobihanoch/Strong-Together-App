import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const LastWorkoutData = ({ lastWorkoutDataForModal }) => {
  // English-only comments: Guarded formatter that returns a friendly fallback
  const displayValue = (value) =>
    value === undefined || value === null ? "Not recorded" : value;

  const { lastWorkoutData = null, setIndex = 0 } =
    lastWorkoutDataForModal || {};

  if (!lastWorkoutData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTextTitle}>No previous data found</Text>
        <Text style={styles.emptyTextSubtitle}>
          Once you complete a set for this exercise, it will appear here.
        </Text>
      </View>
    );
  }

  const dateStr = lastWorkoutData?.workoutdate
    ? new Date(lastWorkoutData.workoutdate).toLocaleDateString()
    : "—";

  return (
    <View style={styles.card}>
      {/* English-only comments: Title + date chip */}
      <Text style={styles.exerciseName}>{lastWorkoutData.exercise}</Text>
      <View style={styles.dateChip}>
        <Text style={styles.dateChipText}>{dateStr}</Text>
      </View>

      {/* English-only comments: Metric "cards" for quick glance */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Weight</Text>
          <Text style={styles.metricValue}>
            {displayValue(lastWorkoutData?.weight?.[setIndex])} kg
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Reps</Text>
          <Text style={styles.metricValue}>
            {displayValue(lastWorkoutData?.reps?.[setIndex])}
          </Text>
        </View>
      </View>

      {/* English-only comments: Notes as a full-width expanding block.
         It can wrap into multiple lines and scroll if it gets too long. */}
      <View style={styles.notesBlock}>
        <Text style={styles.notesLabel}>Notes</Text>
        <View style={styles.notesBox}>
          <ScrollView
            // English-only comments: Allow vertical scroll only if content exceeds box;
            // remove ScrollView if you always want full expansion without internal scroll.
            style={{ maxHeight: RFValue(120) }}
            contentContainerStyle={{ paddingVertical: 2 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.notesText}>
              {displayValue(lastWorkoutData?.notes ?? "None")}
            </Text>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Card wrapper ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },

  // --- Header ---
  exerciseName: {
    fontSize: RFValue(17),
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
    color: "#0f172a",
  },
  dateChip: {
    alignSelf: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dateChipText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#334155",
  },

  // --- Metrics ---
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  metricLabel: {
    fontSize: RFValue(12),
    fontFamily: "Inter_500Medium",
    color: "#6b7280",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: RFValue(16),
    fontFamily: "Inter_700Bold",
    color: "#111827",
  },

  // --- Notes ---
  notesBlock: {
    marginTop: 4,
    gap: 6,
  },
  notesLabel: {
    fontSize: RFValue(13),
    fontFamily: "Inter_500Medium",
    color: "#6b7280",
  },
  notesBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  notesText: {
    fontSize: RFValue(14),
    fontFamily: "Inter_400Regular",
    color: "#1f2937",
    lineHeight: RFValue(18),
  },

  // --- Empty state ---
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
});

export default LastWorkoutData;
