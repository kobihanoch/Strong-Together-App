// English comments only inside code

import React, { useMemo, useState, useCallback, useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCreateWorkout } from "../../../context/CreateWorkoutContext";
import images from "../../images";
import StepperInput from "../../StepperInput";
import { Dialog } from "react-native-alert-notification";

const { width, height } = Dimensions.get("window");
const HANDLE_W = Math.max(18, width * 0.1);
const ACTION_BTN = Math.max(34, width * 0.09);

const PickExerciseItem = ({ exercise, dragHandleProps }) => {
  // Pull context pieces we need
  const { editing, properties, actions } = useCreateWorkout();

  // Resolve muscle image once
  const imagePath = useMemo(
    () => images?.[exercise?.targetmuscle]?.[exercise?.specifictargetmuscle],
    [exercise?.targetmuscle, exercise?.specifictargetmuscle]
  );

  // Modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Tiny press animations
  const editScale = useRef(new Animated.Value(1)).current;
  const delScale = useRef(new Animated.Value(1)).current;
  const onEditIn = useCallback(
    () =>
      Animated.spring(editScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 30,
      }).start(),
    [editScale]
  );
  const onEditOut = useCallback(
    () =>
      Animated.spring(editScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
      }).start(),
    [editScale]
  );
  const onDelIn = useCallback(
    () =>
      Animated.spring(delScale, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 30,
      }).start(),
    [delScale]
  );
  const onDelOut = useCallback(
    () =>
      Animated.spring(delScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
      }).start(),
    [delScale]
  );

  // Open modal
  const handleOpenEdit = useCallback(() => setIsModalVisible(true), []);

  // Delete with confirmation (always use context action)
  const handleDelete = useCallback(() => {
    Dialog.show({
      type: "WARNING",
      title: "Remove exercise",
      textBody: `Are you sure you want to remove "${exercise?.name}" from this split?`,
      button: "Remove",
      autoClose: false, // keep it open until we close manually
      onPressButton: () => {
        actions?.removeExercise?.(String(exercise?.id));
        Dialog.hide();
      },
      // Some versions support this callback to handle outside taps:
      onTouchOutside: () => {
        Dialog.hide();
      },
    });
  }, [exercise, actions]);

  return (
    <View style={{ marginBottom: 0 }}>
      <View style={{ position: "relative" }}>
        {/* Row with left drag handle + card */}
        <View style={{ flexDirection: "row", alignItems: "stretch" }}>
          {/* Left drag handle */}
          <Pressable {...(dragHandleProps || {})} style={styles.dragHandle}>
            <MaterialCommunityIcons
              name="drag-vertical"
              size={RFValue(16)}
              color="rgba(0,0,0,0.35)"
            />
          </Pressable>

          {/* Main card */}
          <TouchableOpacity
            style={styles.exerciseContainer}
            activeOpacity={0.9}
            onPress={() => {}}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 0.35, justifyContent: "center" }}>
                <LinearGradient
                  colors={["rgb(234, 240, 246)", "rgb(234, 240, 246)"]}
                  style={styles.imageContainer}
                >
                  {!!imagePath && (
                    <Image source={imagePath} style={styles.exerciseImage} />
                  )}
                </LinearGradient>
              </View>

              <View style={styles.exerciseInfoContainer}>
                <Text style={styles.exerciseName} numberOfLines={1}>
                  {exercise?.name}
                </Text>
                <Text style={styles.muscleText} numberOfLines={1}>
                  {exercise?.targetmuscle}, {exercise?.specifictargetmuscle}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                {/* Edit */}
                <Animated.View
                  style={[
                    styles.actionBtn,
                    styles.editBtn,
                    { transform: [{ scale: editScale }] },
                  ]}
                >
                  <Pressable
                    onPressIn={onEditIn}
                    onPressOut={onEditOut}
                    onPress={handleOpenEdit}
                    android_ripple={{
                      color: "rgba(255,255,255,0.18)",
                      borderless: true,
                    }}
                    style={styles.actionPressable}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={RFValue(15)}
                      color="#fff"
                    />
                  </Pressable>
                </Animated.View>

                {/* Delete */}
                <Animated.View
                  style={[
                    styles.actionBtn,
                    styles.deleteBtn,
                    { transform: [{ scale: delScale }] },
                  ]}
                >
                  <Pressable
                    onPressIn={onDelIn}
                    onPressOut={onDelOut}
                    onPress={handleDelete}
                    android_ripple={{
                      color: "rgba(255,255,255,0.18)",
                      borderless: true,
                    }}
                    style={styles.actionPressable}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={RFValue(15)}
                      color="#fff"
                    />
                  </Pressable>
                </Animated.View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Reps editor modal */}
        {isModalVisible && (
          <Modal
            visible={isModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>
                  Edit Reps for {exercise?.name}
                </Text>

                {(properties.focusedExerciseSets || []).map((_, index) => (
                  <View key={index} style={styles.modalRow}>
                    <Text style={styles.modalSetLabel}>Set {index + 1}</Text>
                    <StepperInput
                      value={properties.focusedExerciseSets[index]}
                      onChange={(newVal) => {
                        const updated = [...properties.focusedExerciseSets];
                        updated[index] = newVal;
                        properties.setFocusedExerciseSets(updated);
                      }}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Card
  exerciseContainer: {
    backgroundColor: "white",
    width: "86%",
    marginLeft: -15,
    height: height * 0.16,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
    borderColor: "transparent",
    borderWidth: 2,
    padding: width * 0.02,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    overflow: "hidden",
  },
  // Thin left drag handle
  dragHandle: {
    width: HANDLE_W,
    height: height * 0.165,
    alignSelf: "center",
    zIndex: 99,
    marginLeft: width * 0.04,
    marginRight: width * 0.02,
    borderRadius: width * 0.02,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(230, 230, 230, 1)",
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: width * 0.02,
  },
  exerciseImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    opacity: 0.8,
  },
  exerciseInfoContainer: {
    flex: 0.55,
    justifyContent: "center",
    gap: height * 0.01,
    paddingLeft: width * 0.02,
  },
  exerciseName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(13),
    color: "black",
    width: "100%",
  },
  muscleText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#919191",
  },
  // Actions (floating, top-right)
  actionsContainer: {
    flex: 0.1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop: height * 0.008,
    marginRight: width * 0.01,
    gap: height * 0.008,
  },
  actionBtn: {
    width: ACTION_BTN,
    height: ACTION_BTN,
    borderRadius: ACTION_BTN / 2,
    shadowColor: "rgb(90, 90, 90)",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 6,
    overflow: "hidden",
  },
  actionPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    backgroundColor: "#2979FF",
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  modalCard: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: width * 0.05,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(16),
    marginBottom: height * 0.02,
    color: "#1a1a1a",
  },
  modalRow: {
    width: "70%",
    marginBottom: height * 0.015,
  },
  modalSetLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(13),
    color: "#444",
    marginBottom: height * 0.005,
    alignSelf: "center",
  },
  modalSaveBtn: {
    marginTop: height * 0.015,
    backgroundColor: "#2979FF",
    paddingVertical: height * 0.014,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.03,
  },
  modalSaveText: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(14),
    textAlign: "center",
  },
});

export default React.memo(PickExerciseItem);
