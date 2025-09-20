import React, { forwardRef, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Pressable,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SlidingBottomModal from "../SlidingBottomModal";
import { colors } from "../../constants/colors";
import Column from "../Column";
import Row from "../Row";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
// Adjust this import path to where your SlidingBottomModal lives

const { width, height } = Dimensions.get("window");

const ExercisePickerModal = forwardRef(function ExercisePickerModal(
  { selectedSplit, controls, availableExercises, allExercises, muscles },
  ref
) {
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const exToShow =
    selectedMuscle === "All"
      ? allExercises
      : availableExercises[selectedMuscle];
  const [filteredExToShow, setFilteredExToShow] = useState(exToShow ?? []);
  const [query, setQuery] = useState("");
  useEffect(() => {
    setFilteredExToShow(() =>
      exToShow.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, exToShow]);

  const renderItem = useCallback(({ item }) => {
    return (
      <Column style={styles.exContainer}>
        <Text style={styles.exName}>{item?.name}</Text>
        <Text style={styles.exMuscles}>
          {selectedMuscle === "All" ? item?.targetmuscle : selectedMuscle},{" "}
          {item?.specificTargetMuscle}
        </Text>
      </Column>
    );
  });

  return (
    <SlidingBottomModal
      ref={ref}
      snapPoints={["60%", "60%", "80%"]}
      flatListUsage={false}
      title={null}
    >
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <Column style={{ paddingHorizontal: 15, gap: 20 }}>
          {/* Header */}
          <Column style={{ marginTop: 15, gap: 5 }}>
            <Text style={styles.header}>Add Exercise</Text>
            <Text style={styles.semiHeader}>
              Choose from our exercise library
            </Text>
          </Column>

          {/* Search Bar */}
          <Row style={styles.searchBarContainer}>
            <MaterialCommunityIcons
              name={"magnify"}
              color={"#aaaaaaff"}
              size={RFValue(17)}
            />
            <TextInput
              style={styles.searchBarText}
              placeholder="Search Exercises..."
              onBlur={Keyboard.dismiss}
              onChangeText={(val) => setQuery(val)}
              keyboardType="default"
            />
          </Row>
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
          <BottomSheetFlatList
            data={filteredExToShow}
            renderItem={renderItem}
            keyExtractor={(item, idx) => String(item?.id ?? item?.name ?? idx)}
            showsVerticalScrollIndicator={false}
            // Allow taps to work while keyboard is open
            keyboardShouldPersistTaps="handled"
            // Give some bottom padding so last item isn't hidden behind the handle
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </Column>
      </Pressable>
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
  searchBarContainer: {
    borderColor: "#e2e2e2ff",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
    gap: 10,
    alignItems: "center",
  },
  searchBarText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "black",
  },
});

export default ExercisePickerModal;
