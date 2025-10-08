import { MaterialCommunityIcons } from "@expo/vector-icons";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardAwareFlatList,
  KeyboardAwareScrollView,
} from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../constants/colors";
import Column from "../Column";
import PageDots from "../PageDots";
import PercantageCircle from "../PercentageCircle";
import Row from "../Row";
import NumericInputWithRules from "./NumericInputWithRules";
import useLastWorkoutExerciseTrackingData from "../../hooks/useLastWorkoutExerciseTrackingData";
import NumberCounter from "../NumberCounter";

const { width, height } = Dimensions.get("window");

const RenderItem = ({
  item,
  exercisesSetsDoneMap,
  controls,
  workoutProgressObj,
  setLastWorkoutDataForModal,
  setVisibleSetIndexForModal,
  openModal,
}) => {
  // Recorded stats
  const {
    weight: recW = [],
    reps: recR = [],
    notes: recNotes = [],
  } = workoutProgressObj[item?.exercise] || {};
  const exName = item?.exercise;
  const { lastWorkoutData } = useLastWorkoutExerciseTrackingData(item?.id);

  // Controls
  const { addNotes, addWeightRecord, addRepsRecord } = controls || {};

  // Safe destructuring with defaults
  const { planned: plannedSets = 0, done: setsDone = 0 } =
    exercisesSetsDoneMap[item.exercise] || {};

  // Extra sets
  const [extraSets, setExtraSets] = useState(0);

  // Pre-calc totals
  const totalSets = plannedSets + extraSets;

  // Progress: compute vs totalSets; clamp to [0, 100]
  const exProgress =
    totalSets > 0 ? Math.min(100, Math.floor((setsDone / totalSets) * 100)) : 0;

  // Current set number (do not exceed totalSets)
  const currentSetNumber = Math.min(setsDone + 1, Math.max(1, totalSets));

  // Completion state
  const completedAllSets = setsDone >= totalSets && totalSets > 0;

  // Rendered sets (build an array)
  const renderedSets = [];
  for (let setIndex = 0; setIndex < totalSets; setIndex++) {
    //const curW = weights[setIndex];
    //const curR = reps[setIndex];
    const setNumber = setIndex + 1;
    const isSetCompleted = setNumber <= setsDone;
    const isSetInProgress = setNumber == currentSetNumber;
    const isSetLocked = !isSetCompleted && !isSetInProgress;
    const isLastSetDone = setIndex == setsDone - 1;
    const isSetResetable = !isSetLocked && isLastSetDone;

    renderedSets.push(
      <Column
        key={setIndex}
        style={[
          styles.itemSetContainer,
          {
            backgroundColor: isSetCompleted
              ? colors.completedLightTransparent
              : isSetInProgress
              ? colors.lightCardBg
              : "#f2f2f2ff",
            opacity: isSetLocked ? 0.4 : 1,
            borderWidth: isSetLocked ? 0 : 1,
            borderColor: isSetCompleted
              ? colors.completedLight
              : colors.primary,
          },
        ]}
      >
        <Row style={{ gap: 10 }}>
          <View
            style={[
              styles.itemCurrentSetNumberContainer,
              {
                backgroundColor: isSetCompleted
                  ? colors.completedLight
                  : isSetInProgress
                  ? colors.primary
                  : "#a3a3a3ff",
              },
            ]}
          >
            <Text style={styles.itemCurrentSetNumberText}>
              {isSetLocked ? (
                <MaterialCommunityIcons name="lock" size={RFValue(10)} />
              ) : (
                setNumber
              )}
            </Text>
          </View>
          <Text style={styles.itemCurrentSetText}>Set {setNumber}</Text>
          <TouchableOpacity
            style={{ marginLeft: "auto" }}
            disabled={isSetLocked}
            onPress={() => {
              setLastWorkoutDataForModal({ lastWorkoutData, setIndex });
              openModal();
            }}
          >
            <MaterialCommunityIcons name="history" size={RFValue(15)} />
          </TouchableOpacity>
        </Row>
        <Row
          style={{
            marginTop: 20,
            gap: 20,
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Column style={{ width: "50%", gap: 5 }}>
            <Text style={styles.inputHeader}>Weight (kg)</Text>
            <NumericInputWithRules
              initial={setIndex in recW ? recW[setIndex] : 0}
              allowZero={isSetResetable}
              isSetLocked={isSetLocked}
              onValidChange={(val) => {
                addWeightRecord(exName, setIndex, val);
              }}
              style={styles.weightInput}
              keyboardType={"numeric"}
            />
          </Column>
          <Column style={{ width: "50%", gap: 5 }}>
            <Text style={styles.inputHeader}>Reps</Text>
            <NumericInputWithRules
              initial={setIndex in recR ? recR[setIndex] : 0}
              allowZero={isSetResetable}
              isSetLocked={isSetLocked}
              onValidChange={(val) => {
                addRepsRecord(exName, setIndex, val);
              }}
              style={styles.weightInput}
              keyboardType={"number-pad"}
            />
          </Column>
        </Row>
      </Column>
    );
  }

  const dotLength = plannedSets + extraSets; // or: const dotLength = totalSets;

  return (
    <Column style={styles.itemCard}>
      <Row style={{ gap: 10, marginBottom: 20 }}>
        <PercantageCircle
          percent={exProgress}
          actualColor={colors.primary}
          stroke={4}
          duration={1000}
        >
          {completedAllSets ? (
            <MaterialCommunityIcons
              name="check"
              size={RFValue(12)}
              style={styles.pctText}
            />
          ) : (
            <Row>
              <NumberCounter
                numStart={0}
                numEnd={exProgress}
                duration={1000}
                style={styles.pctText}
              />
              <Text style={styles.pctText}>%</Text>
            </Row>
          )}
        </PercantageCircle>

        <Column>
          <Text style={styles.itemExerciseName}>{item.exercise}</Text>
          {/* If you want to show progress vs total including extras: */}
          <Text style={styles.itemSetIndicatorText}>
            {`${setsDone} of ${totalSets} completed`}
          </Text>
          {/* If you prefer “planned only”, keep your original line instead */}
        </Column>

        <Column
          style={{
            marginLeft: "auto",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <PageDots
            length={dotLength}
            index={Math.min(setsDone, Math.max(0, dotLength - 1))}
            fillColor={colors.completedLight}
            fillToIndex={true}
            activeColor={colors.primary}
            fillAll={completedAllSets}
          />
          {/* Set number badge */}
          <View
            style={[
              styles.badge,
              {
                backgroundColor: completedAllSets
                  ? colors.completedLight
                  : colors.lightCardBg,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: completedAllSets
                    ? colors.completedDark
                    : colors.primary,
                },
              ]}
            >
              {completedAllSets ? "Done" : `Set ${currentSetNumber}`}
            </Text>
          </View>
        </Column>
      </Row>

      {renderedSets}

      <TextInput
        style={[styles.notesInput, { textAlignVertical: "top" }]}
        multiline
        numberOfLines={3}
        maxLength={50}
        onEndEditing={({ nativeEvent }) => {
          addNotes(exName, nativeEvent.text);
        }}
        defaultValue={recNotes ?? ""}
        placeholder="Add any notes..."
        returnKeyType="none"
      />
    </Column>
  );
};

const ExercisesSection = ({
  exercises,
  exercisesSetsDoneMap,
  controls,
  workoutProgressObj,
  setLastWorkoutDataForModal,
  setVisibleSetIndexForModal,
  openModal,
}) => {
  return (
    <KeyboardAwareFlatList
      data={exercises}
      renderItem={({ item }) => (
        <RenderItem
          item={item}
          exercisesSetsDoneMap={exercisesSetsDoneMap}
          controls={controls}
          workoutProgressObj={workoutProgressObj}
          setLastWorkoutDataForModal={setLastWorkoutDataForModal}
          setVisibleSetIndexForModal={setVisibleSetIndexForModal}
          openModal={openModal}
        />
      )}
      keyExtractor={(it) => it.exercise}
      enableOnAndroid // turn on automatic handling on Android
      extraScrollHeight={200} // how much to scroll above the focused input
      keyboardShouldPersistTaps="never" // taps on inputs won't dismiss keyboard unexpectedly
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    />
  );
};

const styles = StyleSheet.create({
  itemCard: {
    alignSelf: "center",
    width: "90%",
    borderRadius: 16,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 25,
    shadowColor: "#585858ff",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    // Android shadow
    elevation: 6,
  },
  itemExerciseName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(13),
    color: "black",
  },
  itemSetIndicatorText: {
    fontFamily: "Inter_400Refular",
    fontSize: RFValue(12),
    color: colors.textSecondary,
  },
  pctText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(10),
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.lightCardBg,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(10),
    color: colors.primary,
  },
  itemSetContainer: {
    width: "100%",
    backgroundColor: colors.lightCardBg,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 16,
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  itemCurrentSetNumberContainer: {
    backgroundColor: colors.primary,
    height: 30,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  itemCurrentSetNumberText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(10),
    color: "white",
  },
  itemCurrentSetText: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(10),
    color: "black",
  },
  notesInput: {
    height: height * 0.08,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#f5f5f57a",
    color: "black",
    fontFamily: "Inter_400Regular",
    padding: 10,
    borderColor: "#e4e4e4ff",
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 30,
  },
  weightInput: {
    height: height * 0.06,
    width: "100%",
    textAlign: "center",
    backgroundColor: "transparent",
    color: "black",
    fontFamily: "Inter_400Regular",
    padding: 10,
    borderColor: "#d2d2d2ff",
    borderWidth: 0.5,
    borderRadius: 10,
    fontSize: RFValue(13),
  },
  inputHeader: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "black",
  },
});

export default ExercisesSection;
