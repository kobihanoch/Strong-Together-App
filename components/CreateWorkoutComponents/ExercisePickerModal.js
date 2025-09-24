import { FontAwesome5 } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../constants/colors";
import Column from "../Column";
import Row from "../Row";
import SlidingBottomModal from "../SlidingBottomModal";
import { Notifier, NotifierComponents } from "react-native-notifier";

const { width, height } = Dimensions.get("window");

const ExerciseRow = React.memo(({ item, selectedMuscle, handleExPress }) => {
  //console.log(item.name, "renderd");
  return (
    <TouchableOpacity
      style={styles.exContainer}
      onPress={() => handleExPress(item)}
    >
      {/* Exercise item */}
      <Row style={{ gap: 20 }}>
        <View style={styles.dumbbelIconContainer}>
          <FontAwesome5 name="dumbbell" size={RFValue(12)} color="grey" />
        </View>
        <Column>
          <Text style={styles.exName}>{item?.name}</Text>
          <Text style={styles.exMuscles}>
            {selectedMuscle === "All" ? item?.targetmuscle : selectedMuscle},{" "}
            {item?.specificTargetMuscle}
          </Text>
        </Column>
      </Row>
    </TouchableOpacity>
  );
});

const ExercisePickerModal = forwardRef(function ExercisePickerModal(
  {
    selectedSplit,
    controls,
    availableExercises,
    allExercises,
    muscles,
    exForSplit,
  },
  ref
) {
  const { addExercise } = controls;

  // Refs for better optimzation
  const selectedSplitRef = useRef(null);
  useEffect(() => {
    selectedSplitRef.current = selectedSplit;
  }, [selectedSplit]);
  const exIdsRef = useRef(new Set(exForSplit?.map((e) => e.id)));
  useEffect(() => {
    exIdsRef.current = new Set(exForSplit?.map((e) => e.id));
  }, [exForSplit]);
  const addExerciseRef = useRef(null);
  useEffect(() => {
    addExerciseRef.current = addExercise;
  }, [addExercise]);

  const handleExPress = useCallback((ex) => {
    const currentSplit = selectedSplitRef.current;

    // duplicate check using the latest ids
    if (exIdsRef.current.has(ex.id)) {
      Notifier.showNotification({
        title: "Exercise already added",
        description: `"${ex?.name}" is already added`,
        duration: 2500,
        showAnimationDuration: 250,
        hideOnPress: true,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "error",
          titleStyle: { fontSize: 16 },
          descriptionStyle: { fontSize: 14 },
        },
      });
      return;
    }

    // add and close
    addExerciseRef.current(ex);
    ref?.current?.close();
    Notifier.showNotification({
      title: "Exercise Added",
      description: `"${ex.name}" added to Split ${currentSplit}`,
      duration: 2500,
      showAnimationDuration: 250,
      hideOnPress: true,
      Component: NotifierComponents.Alert,
      componentProps: {
        alertType: "info",
        titleStyle: { fontSize: 16 },
        descriptionStyle: { fontSize: 14 },
      },
    });
  }, []);

  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const exToShow =
    selectedMuscle === "All"
      ? allExercises
      : availableExercises[selectedMuscle];

  const [query, setQuery] = useState("");
  const filteredExToShow = useMemo(
    () =>
      exToShow.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase())
      ),
    [exToShow, query]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ExerciseRow
        item={item}
        selectedMuscle={selectedMuscle}
        handleExPress={handleExPress}
      />
    ),
    [selectedMuscle, handleExPress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

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
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            // Allow taps to work while keyboard is open
            keyboardShouldPersistTaps="handled"
            // Give some bottom padding so last item isn't hidden behind the handle
            contentContainerStyle={{ paddingBottom: height * 0.8 }}
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
  exContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    gap: 3,
    backgroundColor: "white",
    borderRadius: 16,
  },
  exName: {
    fontFamily: "Inter_600SemiBold",
    color: "black",
    fontSize: RFValue(13),
  },
  exMuscles: {
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
    fontSize: RFValue(10),
  },
  dumbbelIconContainer: {
    height: 30,
    width: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.04)",
  },
});

export default ExercisePickerModal;
