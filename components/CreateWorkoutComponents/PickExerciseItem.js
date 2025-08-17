import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
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
  Easing,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import images from "../images";
import StepperInput from "../StepperInput";
import { Dialog } from "react-native-alert-notification";
import { useCreateWorkout } from "../../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");
const HANDLE_W = Math.max(16, width * 0.06);
const CARD_H = height * 0.16;
const MENU_BTN = Math.max(34, width * 0.09);

const PickExerciseItem = ({ exercise, dragHandleProps }) => {
  // Context hooks
  const { editing, actions, utils } = useCreateWorkout();

  // Resolve muscle image once
  const imagePath = useMemo(
    () => images?.[exercise?.targetmuscle]?.[exercise?.specifictargetmuscle],
    [exercise?.targetmuscle, exercise?.specifictargetmuscle]
  );

  // Edit modal state
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Local editable sets (3 slots)
  const [localSets, setLocalSets] = useState([10, 10, 10]);

  useEffect(() => {
    const arr = Array.isArray(exercise?.sets) ? exercise.sets : [10, 10, 10];
    const base =
      arr.length === 3
        ? arr
        : [...arr.slice(0, 3), ...Array(Math.max(0, 3 - arr.length)).fill(10)];
    setLocalSets(
      base.map((n) => {
        const v = Number.isFinite(n) ? n : 10;
        return Math.max(utils.REPS_MIN, Math.min(utils.REPS_MAX, v));
      })
    );
  }, [exercise?.sets, utils.REPS_MIN, utils.REPS_MAX]);

  // Bottom sheet state + animations
  const [menuOpen, setMenuOpen] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(height)).current;

  // Simple guard to avoid double triggering actions
  const actionBusyRef = useRef(false);
  const withActionGuard = (fn) => () => {
    if (actionBusyRef.current) return;
    actionBusyRef.current = true;
    try {
      fn?.();
    } finally {
      // release on next tick so animations can start
      setTimeout(() => (actionBusyRef.current = false), 0);
    }
  };

  const openMenu = useCallback(() => {
    if (menuOpen) return;
    setMenuOpen(true);
    backdropOpacity.setValue(0);
    sheetY.setValue(height);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(sheetY, {
        toValue: 0,
        tension: 220,
        friction: 24,
        useNativeDriver: true,
      }),
    ]).start();
  }, [menuOpen, backdropOpacity, sheetY]);

  // Close menu and run optional callback after fully closed
  const closeMenu = useCallback(
    (onClosed) => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sheetY, {
          toValue: height,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMenuOpen(false);
          // Defer to next frame to avoid modal stacking conflicts
          requestAnimationFrame(() => onClosed?.());
        }
      });
    },
    [backdropOpacity, sheetY]
  );

  // Open edit modal after the sheet fully closes
  const handleOpenEdit = useCallback(
    withActionGuard(() => {
      if (!menuOpen) {
        setIsModalVisible(true);
      } else {
        closeMenu(() => setIsModalVisible(true));
      }
    }),
    [menuOpen, closeMenu]
  );

  // Save sets to context
  const handleSaveSets = useCallback(() => {
    const safeSets = localSets.map((n) =>
      Math.max(utils.REPS_MIN, Math.min(utils.REPS_MAX, Number(n) || 0))
    );
    actions?.setSelectedExercises?.((prev) => {
      const key = editing?.editedSplit;
      const list = prev?.[key] ?? [];
      const idx = list.findIndex(
        (it) => String(it?.id) === String(exercise?.id)
      );
      if (idx === -1) return prev;
      const updatedItem = { ...list[idx], sets: safeSets };
      const next = [...list];
      next[idx] = updatedItem;
      return { ...prev, [key]: next };
    });
    setIsModalVisible(false);
  }, [
    localSets,
    actions,
    editing?.editedSplit,
    exercise?.id,
    utils.REPS_MIN,
    utils.REPS_MAX,
  ]);

  // Remove with confirmation — open dialog only after sheet fully closes
  const handleRemove = useCallback(
    withActionGuard(() => {
      const showDialog = () =>
        Dialog.show({
          type: "WARNING",
          title: "Remove exercise",
          textBody: `Are you sure you want to remove "${exercise?.name}" from this split?`,
          button: "Remove",
          autoClose: false,
          onPressButton: () => {
            actions?.removeExercise?.(String(exercise?.id));
            Dialog.hide();
          },
          onTouchOutside: () => {
            Dialog.hide();
          },
        });

      if (!menuOpen) {
        showDialog();
      } else {
        closeMenu(showDialog);
      }
    }),
    [exercise?.name, exercise?.id, actions, menuOpen, closeMenu]
  );

  return (
    <View style={{ marginBottom: 0 }}>
      <View style={{ position: "relative" }}>
        {/* Row with left drag handle + card */}
        <View style={{ flexDirection: "row", alignItems: "stretch" }}>
          {/* Left drag handle (grip dots) */}
          <Pressable {...(dragHandleProps || {})} style={styles.dragHandle}>
            <View style={styles.gripColumn}>
              {[...Array(3)].map((_, i) => (
                <View key={`g1-${i}`} style={styles.gripDot} />
              ))}
            </View>
            <View style={[styles.gripColumn, { marginLeft: 3 }]}>
              {[...Array(3)].map((_, i) => (
                <View key={`g2-${i}`} style={styles.gripDot} />
              ))}
            </View>
          </Pressable>

          {/* Main card */}
          <View style={styles.exerciseContainer}>
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

              {/* Kebab menu */}
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={openMenu}
                  style={styles.menuBtn}
                >
                  <Text style={styles.menuIcon}>⋮</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Edit sets modal */}
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
                  Edit sets for {exercise?.name}
                </Text>

                {[0, 1, 2].map((i) => (
                  <View key={i} style={styles.modalRow}>
                    <Text style={styles.modalSetLabel}>{`Set ${i + 1}`}</Text>
                    <StepperInput
                      value={localSets[i] ?? 10}
                      onChange={(val) => {
                        const safe = Math.max(
                          utils.REPS_MIN,
                          Math.min(utils.REPS_MAX, val)
                        );
                        const next = [...localSets];
                        next[i] = safe;
                        setLocalSets(next);
                      }}
                      min={utils.REPS_MIN}
                      max={utils.REPS_MAX}
                      step={1}
                    />
                  </View>
                ))}

                <TouchableOpacity
                  onPress={handleSaveSets}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Bottom sheet menu */}
        <Modal
          visible={menuOpen}
          transparent
          animationType="none"
          onRequestClose={() => closeMenu()}
        >
          {/* Backdrop (fade only). pointerEvents ensures touches on the sheet are not blocked */}
          <Animated.View
            pointerEvents="auto"
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "rgba(0,0,0,0.35)", opacity: backdropOpacity },
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={() => closeMenu()} />
          </Animated.View>

          {/* Sliding sheet */}
          <Animated.View
            pointerEvents="box-none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              transform: [{ translateY: sheetY }],
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderTopLeftRadius: width * 0.05,
                borderTopRightRadius: width * 0.05,
                paddingHorizontal: width * 0.06,
                paddingTop: height * 0.02,
                paddingBottom: height * 0.03,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 8,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  width: 44,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(0,0,0,0.12)",
                  marginBottom: 8,
                }}
              />
              <Text
                style={{
                  fontSize: RFValue(14),
                  fontFamily: "Inter_700Bold",
                  color: "#111",
                  marginBottom: 6,
                }}
              >
                {exercise?.name}
              </Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleOpenEdit}
                style={styles.sheetItem}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={RFValue(16)}
                  color="#2979FF"
                />
                <Text style={styles.sheetItemText}>Edit sets</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleRemove}
                style={[styles.sheetItem, { marginTop: 8 }]}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={RFValue(16)}
                  color="#FF3B30"
                />
                <Text style={[styles.sheetItemText, { color: "#FF3B30" }]}>
                  Remove
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => closeMenu()}
                style={styles.sheetCancel}
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
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
    paddingLeft: width * 0.05,
    height: CARD_H,
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

  // Drag handle
  dragHandle: {
    width: HANDLE_W,
    height: CARD_H + height * 0.005,
    alignSelf: "center",
    zIndex: 2,
    marginLeft: width * 0.04,
    marginRight: width * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  gripColumn: {
    alignItems: "center",
    justifyContent: "space-between",
    height: CARD_H * 0.38,
  },
  gripDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,0,0,0.35)",
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
    opacity: 0.85,
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
    color: "#667085",
  },

  // Kebab menu
  menuContainer: {
    flex: 0.1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop: height * 0.008,
    marginRight: width * 0.01,
  },
  menuBtn: {
    width: MENU_BTN,
    height: MENU_BTN,
    borderRadius: MENU_BTN / 2,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(90, 90, 90)",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  menuIcon: {
    fontSize: RFValue(18),
    color: "#2979FF",
    lineHeight: RFValue(18),
  },

  // Edit sets modal
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

  // Bottom sheet items
  sheetItem: {
    height: Math.max(46, height * 0.056),
    borderRadius: width * 0.03,
    backgroundColor: "rgb(243, 246, 249)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 8,
  },
  sheetItemText: {
    marginLeft: 10,
    fontSize: RFValue(13),
    fontFamily: "Inter_700Bold",
    color: "#111",
  },
  sheetCancel: {
    height: Math.max(46, height * 0.054),
    borderRadius: width * 0.03,
    borderWidth: 2,
    borderColor: "rgb(234, 240, 246)",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  sheetCancelText: {
    fontSize: RFValue(13),
    fontFamily: "Inter_700Bold",
    color: "#111",
  },
});

export default React.memo(PickExerciseItem);
