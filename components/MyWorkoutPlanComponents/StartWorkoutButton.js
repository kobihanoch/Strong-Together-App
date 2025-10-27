import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

const StartWorkoutButton = ({ hasTrainedToday, selectedSplit, canWorkout }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.cta, { opacity: hasTrainedToday ? 0.7 : 1 }]}
      disabled={!!hasTrainedToday}
      onPress={() =>
        canWorkout
          ? navigation.navigate("StartWorkout", {
              workoutSplit: selectedSplit,
            })
          : navigation.navigate("UpgradeSub")
      }
    >
      {hasTrainedToday ? (
        <MaterialCommunityIcons
          name="lock"
          color="#FFFFFF"
          size={RFValue(14)}
          style={{ marginRight: 6 }}
        />
      ) : (
        !canWorkout && (
          <MaterialCommunityIcons
            name="lock"
            color={colors.warning}
            size={RFValue(14)}
            style={{ marginRight: 6 }}
          />
        )
      )}

      <Text style={styles.ctaText}>
        {hasTrainedToday
          ? "Already trained today"
          : canWorkout
          ? "Start Workout"
          : "Upgrade to Pro"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // CTA
  cta: {
    backgroundColor: "#2979FF",
    height: height * 0.065,
    borderRadius: height * 0.02,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(14.5),
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});

export default StartWorkoutButton;
