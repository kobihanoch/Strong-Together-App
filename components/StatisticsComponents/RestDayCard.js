// SleekRestDayCard.js
import React from "react";
import { Dimensions, StyleSheet, Text, View, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const RestDayCard = ({ onPlanPress }) => {
  // English comments only
  return (
    <View style={styles.card}>
      {/* Accent ribbon */}
      <View style={styles.ribbon} />

      {/* Watermark icon */}
      <MaterialCommunityIcons
        name="power-sleep"
        size={220}
        color="rgba(13,59,102,0.06)"
        style={styles.watermark}
      />

      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons
            name="calendar-check"
            size={RFValue(20)}
            color="#0D3B66"
          />
        </View>
        <Text style={styles.headerText}>Rest Day</Text>
      </View>

      {/* Copy */}
      <Text style={styles.title}>Recover & Rebuild</Text>
      <Text style={styles.subtitle}>
        Light movement, quality protein, good sleep. Give your body what it
        needs to come back stronger.
      </Text>

      {/* Quick tips */}
      <View style={styles.pillRow}>
        <Pill icon="cup-water" label="Hydrate" />
        <Pill icon="food-variant" label="Protein" />
        <Pill icon="walk" label="Easy walk" />
        <Pill icon="sleep" label="Good sleep" />
      </View>

      {/* CTAs */}
      <View style={styles.btnRow}>
        <FilledButton label="Plan next workout" onPress={onPlanPress} />
      </View>
    </View>
  );
};

const Pill = ({ icon, label }) => (
  <View style={styles.pill}>
    <MaterialCommunityIcons name={icon} size={RFValue(13)} color="#0D3B66" />
    <Text style={styles.pillText}>{label}</Text>
  </View>
);

const GhostButton = ({ label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.btnGhost, pressed && styles.pressed]}
  >
    <Text style={styles.btnGhostText}>{label}</Text>
  </Pressable>
);

const FilledButton = ({ label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.btnFilled, pressed && styles.pressed]}
  >
    <Text style={styles.btnFilledText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: height * 0.028,
    paddingHorizontal: width * 0.055,
    marginTop: height * 0.035,
    overflow: "hidden",
    height: height * 0.4,
    // subtle elevation/shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(13,59,102,0.06)",
  },

  ribbon: {
    // diagonal accent strip
    position: "absolute",
    top: -height * 0.03,
    left: -width * 0.35,
    width: width * 0.9,
    height: 16,
    backgroundColor: "#2E6EF7",
    transform: [{ rotate: "-8deg" }],
    opacity: 0.95,
  },

  watermark: {
    position: "absolute",
    right: -40,
    bottom: -35,
    opacity: 0,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(16),
    color: "#0D3B66",
  },

  title: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(18),
    color: "#0D3B66",
    marginTop: 4,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(11.5),
    color: "#335A7D",
    lineHeight: RFValue(17),
    marginTop: 6,
  },

  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(13,59,102,0.12)",
  },
  pillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(10.5),
    color: "#0D3B66",
  },

  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: height * 0.06,
    justifyContent: "center",
  },
  btnGhost: {
    borderWidth: 1.5,
    borderColor: "#0D3B66",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  btnGhostText: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(13),
    color: "#0D3B66",
  },
  btnFilled: {
    backgroundColor: "#2E6EF7",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: "100%",
  },
  btnFilledText: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(13),
    color: "#FFFFFF",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.85,
  },
});

export default RestDayCard;
