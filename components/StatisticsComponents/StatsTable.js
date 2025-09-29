// StatsTable.js
// JS only; Expo-friendly
// One-file component: Set / Reps / Weight table with compact delta pills for both columns.
// Expected rows shape: [{ id?, setNo, reps, repsDelta(number), weight, weightDelta(number) }]

import React, { memo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

// Compact delta pill with ONLY sign and number ("+ 2.5" / "- 2.5").
// For zero/missing delta we render NOTHING (no pill at all).
const DeltaPill = memo(function DeltaPill({ delta }) {
  const isNum = typeof delta === "number" && !isNaN(delta);
  if (!isNum || delta === 0) return null;

  const neg = delta < 0;
  const bg = neg ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)";
  const border = neg ? "rgba(239,68,68,0.35)" : "rgba(34,197,94,0.35)";
  const fg = neg ? "#991B1B" : "#065F46";
  const label = `${neg ? "-" : "+"} ${Math.abs(delta)}`;

  return (
    <View
      style={[pillStyles.pill, { backgroundColor: bg, borderColor: border }]}
    >
      {/* Text only inside the pill */}
      <Text
        style={[pillStyles.text, { color: fg }]}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
        {label}
      </Text>
    </View>
  );
});

const pillStyles = StyleSheet.create({
  // Compact pill; no dot; allow shrinking so it never overflows
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 1,
  },
  text: {
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

function StatsTable({ rows = [] }) {
  // Header row
  const Header = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Set</Text>
      <Text style={[styles.headerCell, styles.center]}>Reps</Text>
      <Text style={[styles.headerCell, styles.right]}>Weight</Text>
    </View>
  );

  // Each data row
  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 1 && styles.altRow]}>
      {/* Set column */}
      <View style={[styles.cell, styles.setCol]}>
        <Text style={styles.setText}>{`#${item.setNo}`}</Text>
      </View>

      {/* Reps column: delta pill (if non-zero) + value */}
      <View style={[styles.cell, styles.repsCol]}>
        <View style={styles.repsWrap}>
          <DeltaPill delta={item.repsDelta} />
          <Text style={[styles.repsValue, { marginLeft: 6 }]}>{item.reps}</Text>
        </View>
      </View>

      {/* Weight column: delta pill (if non-zero) + value (right aligned) */}
      <View style={[styles.cell, styles.weightCol]}>
        <View style={styles.weightWrap}>
          <DeltaPill delta={item.weightDelta} />
          <Text style={[styles.weightText, { marginLeft: 6 }]}>
            {item.weight}
            <Text style={styles.unitText}> kg</Text>
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.tableCard}>
      <Header />
      <FlatList
        data={rows}
        keyExtractor={(it, i) => String(it?.id ?? it?.setNo ?? i)}
        renderItem={renderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Outer card
  tableCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },

  // Header
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerCell: {
    flex: 1,
    color: "#64748B",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  center: { textAlign: "center" },
  right: { textAlign: "right" },

  // Rows
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  altRow: { backgroundColor: "#FBFDFF" },
  separator: { height: 8 },

  // Cells
  cell: { justifyContent: "center" },
  setCol: { flex: 0.8 },
  repsCol: { flex: 1.4 },
  weightCol: { flex: 1.2 },

  // Text styles
  setText: {
    color: "#0F172A",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },

  repsWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  repsValue: {
    color: "#0F172A",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },

  weightWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 1,
  },
  weightText: {
    color: "#0F172A",
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  unitText: {
    color: "#64748B",
    fontWeight: "400",
    fontFamily: "Inter_400Regular",
  },
});

export default StatsTable;
