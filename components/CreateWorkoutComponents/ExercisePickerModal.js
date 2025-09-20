import React, { forwardRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SlidingBottomModal from "../SlidingBottomModal";
import { colors } from "../../constants/colors";
import Column from "../Column";
import Row from "../Row";
import { ScrollView } from "react-native-gesture-handler";
// Adjust this import path to where your SlidingBottomModal lives

const { width, height } = Dimensions.get("window");

const ExercisePickerModal = forwardRef(function ExercisePickerModal(
  { selectedSplit, controls, availableExercises },
  ref
) {
  const muscles = ["All", ...Object.keys(availableExercises)];
  const [selectedMuscle, setSelectedMuscle] = useState("Legs");

  return (
    <SlidingBottomModal
      ref={ref}
      snapPoints={["60%", "60%", "80%"]}
      flatListUsage={false}
      title={null}
    >
      <Column style={{ paddingHorizontal: 15, gap: 20 }}>
        {/* Header */}
        <Column style={{ marginTop: 15, gap: 5 }}>
          <Text style={styles.header}>Add Exercise</Text>
          <Text style={styles.semiHeader}>
            Choose from our exercise library
          </Text>
        </Column>

        {/* Search Bar */}

        {/* Muscle Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ overflow: "visible" }}
        >
          {muscles?.map((muscle) => {
            const isMuscleSelected = selectedMuscle === muscle;
            return (
              <TouchableOpacity
                style={[
                  styles.muscleTab,
                  isMuscleSelected ? { backgroundColor: colors.primary } : {},
                ]}
                key={muscle}
                onPress={() => setSelectedMuscle(muscle)}
              >
                <Text
                  style={[
                    styles.muscleTabText,
                    isMuscleSelected
                      ? { color: "white", fontFamily: "Inter_600SemiBold" }
                      : {},
                  ]}
                >
                  {muscle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <FlatList
          data={
            selectedMuscle === "All"
              ? Object.values(availableExercises).flat()
              : availableExercises[selectedMuscle]
          }
          renderItem={({ item }) => {
            return <Text>{item.name}</Text>;
          }}
          showsVerticalScrollIndicator={false}
        />
      </Column>
    </SlidingBottomModal>
  );
});

const styles = StyleSheet.create({
  muscleTab: {
    backgroundColor: colors.lightCardBg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 10,
    height: height * 0.04,
  },
  muscleTabText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(13),
    color: "black",
  },
  header: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(15),
    color: "black",
  },
  semiHeader: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(13),
    color: colors.textSecondary,
  },
});

export default ExercisePickerModal;
