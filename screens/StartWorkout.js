import React, { useCallback, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Dialog } from "react-native-alert-notification";
import { RFValue } from "react-native-responsive-fontsize";
import SlidingBottomModal from "../components/SlidingBottomModal";
import ExercisesSection from "../components/StartWorkoutComponents/ExercisesSection";
import LastWorkoutData from "../components/StartWorkoutComponents/LastWorkoutData";
import TopBar from "../components/StartWorkoutComponents/TopBar";
import useStartWorkoutPageLogic from "../hooks/logic/useStartWorkoutPageLogic";

const { width, height } = Dimensions.get("window");

const StartWorkout = ({ navigation, route }) => {
  const {
    data: workoutData,
    saving: workoutSaving,
    controls,
    workoutProgressObj,
    onExit,
  } = useStartWorkoutPageLogic(
    route.params?.workoutSplit,
    route.params?.resumedWorkout
  );
  const [lastWorkoutDataForModal, setLastWorkoutDataForModal] = useState(null);

  const modalRef = useRef(null);
  const openModal = useCallback(() => {
    modalRef?.current?.open?.(0);
  }, []);

  const handlePressSave = useCallback(async () => {
    let pressedYes = false;

    Dialog.show({
      type: "SUCCESS",
      title: "Finish Workout?",
      textBody: "Are you sure you’ve completed your workout?",
      button: "Yes, Finish",
      closeOnOverlayTap: true,
      onPressButton: async () => {
        pressedYes = true;
        Dialog.hide();
        await workoutSaving.saveData();
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
  }, [workoutSaving]);

  const handlePresExit = useCallback(async () => {
    let pressedYes = false;

    Dialog.show({
      type: "WARNING",
      title: "Exit Workout?",
      textBody:
        "Are you sure you want to quit the workout? All progress will be lost.",
      button: "Yes, Exit",
      closeOnOverlayTap: true,
      onPressButton: async () => {
        pressedYes = true;
        Dialog.hide();
        await onExit();
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
  }, [workoutSaving]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TopBar
          workoutName={workoutData?.workoutName}
          totalSets={workoutData?.totalSets}
          setsDone={workoutData?.setsDone}
          timerProps={{
            startTime: workoutData?.startTime,
            pausedTotal: workoutData?.pausedTotal,
          }}
          saveWorkout={handlePressSave}
          isSaving={workoutSaving?.saveStarted}
          onExit={handlePresExit}
        />
        <ExercisesSection
          exercises={workoutData?.exercisesForSelectedSplit}
          exercisesSetsDoneMap={workoutData?.setsDoneWithExerciseNameKey}
          controls={controls}
          workoutProgressObj={workoutProgressObj}
          setLastWorkoutDataForModal={setLastWorkoutDataForModal}
          openModal={openModal}
        />
      </View>

      <SlidingBottomModal
        title="Last Performance"
        ref={modalRef}
        snapPoints={["40%", "50%", "80%"]}
        flatListUsage={false}
      >
        <LastWorkoutData
          lastWorkoutDataForModal={lastWorkoutDataForModal}
        ></LastWorkoutData>
      </SlidingBottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  countdownContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00142a",
    zIndex: 1,
  },
  countdownText: {
    fontSize: RFValue(80),
    color: "white",
    fontFamily: "PoppinsBold",
  },
  exerciseContainer: { width, flex: 1, backgroundColor: "white" },
  infoContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exerciseName: {
    fontFamily: "PoppinsBold",
    fontSize: RFValue(20),
    color: "white",
    marginTop: height * 0.03,
  },
  exerciseDescription: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(15),
    color: "#8ca7d1",
    marginTop: height * 0.01,
  },
  setContainer: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignSelf: "center",
  },
  setLabel: {
    fontSize: RFValue(25),
    color: "#00142a",
  },
  input: {
    backgroundColor: "#fafafa",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    fontSize: RFValue(18),
    justifyContent: "center",
    textAlign: "center",
  },
});

export default StartWorkout;
