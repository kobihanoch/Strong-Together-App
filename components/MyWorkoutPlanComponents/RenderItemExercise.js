import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../constants/colors";
import Column from "../Column";

const { width, height } = Dimensions.get("window");

// Optional: extract brand blue used across the app (matches your Badge chip)
const BRAND_BLUE = "#2979FF";

const RenderItemExercise = ({ item }) => {
  // Guard against missing fields
  const exerciseName = item?.exercise ?? "";
  const main = item?.targetmuscle ?? "";
  const specific = item?.specifictargetmuscle ?? "";
  const setsLabel = Array.isArray(item?.sets) ? item.sets.join(" / ") : "";

  return (
    <View style={styles.row}>
      {/* Left text block */}
      <Column style={styles.leftCol}>
        <Text style={styles.title}>{exerciseName}</Text>
        <Text style={styles.subtitle}>
          {main}
          {main && specific ? ", " : ""}
          <Text style={styles.subtitleMuted}>{specific}</Text>
        </Text>
      </Column>

      {/* Right pill for sets */}
      <View style={styles.setsPill}>
        <Text style={styles.setsText}>{setsLabel}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Flat row without heavy card background to feel premium and airy
  row: {
    width: "100%",
    paddingVertical: height * 0.022,
    // Rely on sheet/container padding for horizontal spacing
  },

  leftCol: {
    gap: 6,
    paddingRight: width * 0.04,
  },

  // Primary title
  title: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(15.5),
    color: "#0F172A", // slate-900-ish for crisp contrast on white
    letterSpacing: 0.1,
  },

  // Secondary line
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(12),
    color: "#475569", // slate-600-ish
  },
  subtitleMuted: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: colors.textSecondary, // keep your existing secondary
  },

  // Right-side pill for sets
  setsPill: {
    alignSelf: "center",
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(41, 121, 255, 0.10)", // BRAND_BLUE with low alpha
  },
  setsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(11.5),
    color: BRAND_BLUE,
    letterSpacing: 0.2,
  },

  // Hairline divider to separate rows (looks cleaner than boxed cards)
  divider: {
    marginTop: height * 0.018,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(2, 6, 23, 0.08)", // subtle line
  },
});

export default React.memo(RenderItemExercise);
