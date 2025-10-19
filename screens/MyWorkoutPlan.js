import React, { useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Column from "../components/Column.js";
import RenderItemExercise from "../components/MyWorkoutPlanComponents/RenderItemExercise.js";
import SplitFlatList from "../components/MyWorkoutPlanComponents/SplitFlatList.js";
import SlidingBottomModal from "../components/SlidingBottomModal.js";
import { useCardioContext } from "../context/CardioContext.js";
import { useMyWorkoutPlanPageLogic } from "../hooks/logic/useMyWorkoutPlanPageLogic.js";
import useLightStatusBar from "../hooks/useLightStatusBar.js";
import { formatTime } from "../utils/statisticsUtils.js";
import Row from "../components/Row.js";
import { logUserCardio } from "../services/CardioService.js";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { useNavigation } from "@react-navigation/native";
import NoWorkoutPlan from "../components/MyWorkoutPlanComponents/NoWorkoutPlan.js";

const { width, height } = Dimensions.get("window");

const onlyDigits = (t) => t.replace(/\D/g, "");
const clampSec = (t) => {
  const n = parseInt(t || "0", 10);
  if (Number.isNaN(n)) return "0";
  return String(Math.max(0, Math.min(59, n)));
};

const MyWorkoutPlan = () => {
  const nav = useNavigation();
  const { hasWorkout, filteredExercises, setSelectedSplit, selectedSplit } =
    useMyWorkoutPlanPageLogic();

  const {
    hasDoneCardioToday = false,
    cardioForToday = null,
    setDailyCardioMap,
    setWeeklyCardioMap,
  } = useCardioContext() || {};

  // Modals
  const exRef = useRef(null);
  const cardioRef = useRef(null);
  const openCardioModal = (i = 0) => {
    cardioRef?.current?.open?.(i);
  };

  // Local cardio inputs
  const [cardioType, setCardioType] = useState("Walk");
  const [mins, setMins] = useState("");
  const [secs, setSecs] = useState("");
  const [isCardioSave, setIsCardioSave] = useState(false);

  const saveLockRef = useRef(false);
  const onSaveCardio = async () => {
    if (saveLockRef.current) return;
    saveLockRef.current = true;
    try {
      setIsCardioSave(true);
      const m = parseInt(mins || "0", 10) || 0;
      const s = parseInt(clampSec(secs), 10) || 0;
      if (m === 0 && s === 0) return; // no-op
      const res = await logUserCardio(m, s, cardioType);
      const { daily, weekly } = res;
      setDailyCardioMap(daily);
      setWeeklyCardioMap(weekly);
      Keyboard.dismiss();
      cardioRef.current?.close?.();
      Notifier.showNotification({
        title: "Cardio logged",
        description: "Cardio added successfully",
        duration: 2500,
        showAnimationDuration: 250,
        hideOnPress: true,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "success",
          titleStyle: { fontSize: 16 },
          descriptionStyle: { fontSize: 14 },
        },
      });
      nav.replace("Statistics");
    } finally {
      saveLockRef.current = false;
      setIsCardioSave(false);
    }
  };

  useLightStatusBar();

  return hasWorkout ? (
    <View style={styles.container}>
      <View>
        {/* Splits */}
        <SplitFlatList
          setSelectedSplit={setSelectedSplit}
          selectedSplit={selectedSplit}
          filteredExercises={filteredExercises}
          openCardioModal={openCardioModal}
        />

        {/* Exercises modal */}
        <SlidingBottomModal
          title="Exercises"
          ref={exRef}
          data={filteredExercises}
          renderItem={({ item }) => <RenderItemExercise item={item} />}
          enableBackDrop={false}
          enablePanDownClose={false}
          snapPoints={["15%", "50%", "85%"]}
          flatListUsage={true}
          initialIndex={0}
        />

        {/* Cardio modal */}
        <SlidingBottomModal
          title="Cardio"
          ref={cardioRef}
          enableBackDrop={true}
          snapPoints={["30%", "50%", "85%"]}
          flatListUsage={false}
          initialIndex={-1}
        >
          <Column
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: height * 0.05,
              paddingHorizontal: 20,
              gap: 16,
            }}
          >
            {hasDoneCardioToday ? (
              <Text style={styles.cardioText}>
                You{" "}
                <Text style={styles.cardioTextStrong}>
                  {cardioForToday?.type === "Run"
                    ? "Ran"
                    : cardioForToday?.type + "ed"}
                </Text>{" "}
                for{" "}
                <Text style={styles.cardioTextStrong}>
                  {formatTime(
                    cardioForToday?.duration_mins,
                    cardioForToday?.duration_sec
                  )}
                </Text>{" "}
                today, good job!
              </Text>
            ) : (
              <Column style={styles.cardioCard}>
                {/* Type selector */}
                <Row style={{ gap: 10 }}>
                  {["Walk", "Run"].map((opt) => {
                    const active = cardioType === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => setCardioType(opt)}
                        style={[
                          styles.typePill,
                          active && { backgroundColor: "#2979FF" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typePillText,
                            active && {
                              color: "white",
                              fontFamily: "Inter_600SemiBold",
                            },
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </Row>

                {/* Time inputs */}
                <Row style={styles.timeRow}>
                  <Column style={styles.timeField}>
                    <Text style={styles.timeLabel}>Min</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={mins}
                      onChangeText={(t) => setMins(onlyDigits(t))}
                      keyboardType="number-pad"
                      maxLength={3}
                      placeholder="0"
                      returnKeyType="done"
                      onFocus={() => openCardioModal(2)}
                    />
                  </Column>

                  <Text style={styles.colon}>:</Text>

                  <Column style={styles.timeField}>
                    <Text style={styles.timeLabel}>Sec</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={secs}
                      onChangeText={(t) => setSecs(onlyDigits(t))}
                      onBlur={() =>
                        setSecs((s) => {
                          return clampSec(s);
                        })
                      }
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="00"
                      returnKeyType="done"
                      onFocus={() => openCardioModal(2)}
                    />
                  </Column>
                </Row>

                {/* Save button */}
                {isCardioSave ? (
                  <ActivityIndicator />
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.plusBtn,
                      styles.saveBtn,
                      (parseInt(mins || "0", 10) || 0) === 0 &&
                        (parseInt(secs || "0", 10) || 0) === 0 && {
                          opacity: 0.5,
                        },
                    ]}
                    onPress={onSaveCardio}
                    disabled={
                      ((parseInt(mins || "0", 10) || 0) === 0 &&
                        (parseInt(secs || "0", 10) || 0) === 0) ||
                      isCardioSave
                    }
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                )}
              </Column>
            )}
          </Column>
        </SlidingBottomModal>
      </View>
    </View>
  ) : (
    <NoWorkoutPlan
      onCreatePress={() => nav.navigate("CreateWorkout")}
    ></NoWorkoutPlan>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },

  // Split cards (unchanged)
  header: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(20),
    marginLeft: width * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splitContainer: {
    padding: height * 0.01,
    flex: 1,
    backgroundColor: "white",
    width: width * 0.5,
    borderRadius: width * 0.04,
    borderColor: "#c9c9c9",
    borderWidth: 0.2,
    marginLeft: width * 0.05,
    marginVertical: height * 0.02,
  },
  selectedSplitContainer: {
    backgroundColor: "#00142a",
    width: width * 0.7,
  },
  splitName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(25),
  },
  splitExercises: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#666",
  },
  exerciseContainer: {
    backgroundColor: "#F3F4F6",
    width: "90%",
    alignSelf: "center",
    height: height * 0.14,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
  },
  exerciseName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(16),
    color: "#007bff",
  },
  exerciseDetails: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#555",
    marginTop: height * 0.005,
  },

  // Cardio display text
  cardioText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(14),
    textAlign: "center",
  },
  cardioTextStrong: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(14),
    textAlign: "center",
  },

  // Cardio input card
  cardioCard: {
    width: width * 0.9,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 14,
    gap: 14,
    alignItems: "center",
  },
  typePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#E9EEF6",
  },
  typePillText: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(12),
    color: "black",
  },
  timeRow: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  timeField: {
    width: width * 0.28,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(10),
    color: "#666",
    marginBottom: 4,
  },
  timeInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(16),
    color: "black",
  },
  colon: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(16),
    color: "#666",
    marginHorizontal: 2,
  },

  // Save button + base plusBtn style
  plusBtn: {
    minWidth: 90,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: "#2979FF",
  },
  saveText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(12),
    color: "white",
  },
});

export default MyWorkoutPlan;
