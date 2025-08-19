import React, { useMemo, useCallback, useRef, useState } from "react";
import {
  Dimensions,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useCreateWorkout } from "../../context/CreateWorkoutContext";

const { width, height } = Dimensions.get("window");

// Slightly larger tabs for better touch targets and to de-bulk the menu button
const TAB_H = Math.max(64, height * 0.11);
const TAB_W = Math.max(92, width * 0.3);
const GAP_W = Math.max(20, width * 0.055);

// Bottom sheet constants
const SHEET_RADIUS = width * 0.05;
const SHEET_PAD_H = width * 0.05;
const SHEET_PAD_V = height * 0.035;
const SHEET_SPRING = { tension: 220, friction: 24 };

// Alphabet helper
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const SplitTabsRow = () => {
  const { userWorkout, editing, actions } = useCreateWorkout();

  // Current split keys sorted
  const splits = useMemo(
    () =>
      (userWorkout?.workoutSplits ?? []).sort((a, b) =>
        String(a).localeCompare(String(b))
      ),
    [userWorkout?.workoutSplits]
  );

  // --- Bottom sheet state and animations ---
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTarget, setSheetTarget] = useState(null);

  // Backdrop opacity (does NOT slide)
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  // Sheet translateY from bottom (we animate this; Modal has no default animation)
  const sheetY = useRef(new Animated.Value(height)).current;

  // Open menu for a given split (animate backdrop fade-in + sheet slide-up)
  const openSheetFor = useCallback(
    (splitKey) => {
      setSheetTarget(splitKey);
      setSheetVisible(true);
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
          ...SHEET_SPRING,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [backdropOpacity, sheetY]
  );

  // Close menu (animate reverse)
  const closeSheet = useCallback(() => {
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
        setSheetVisible(false);
        setSheetTarget(null);
      }
    });
  }, [backdropOpacity, sheetY]);

  // Compute next letter (A..Z only)
  const getNextLetter = useCallback(() => {
    if (!splits?.length) return "A";
    const letters = splits
      .map((s) => String(s).toUpperCase())
      .filter((s) => /^[A-Z]$/.test(s))
      .sort();
    const last = letters[letters.length - 1] ?? "A";
    const nextIdx = ABC.indexOf(last) + 1;
    if (nextIdx < 0 || nextIdx >= ABC.length) return null; // hit 'Z'
    return ABC[nextIdx];
  }, [splits]);

  // Add split -> add empty array and select it
  const handleAddSplit = useCallback(() => {
    const next = getNextLetter();
    if (!next) return;
    actions?.setSelectedExercises?.((prev) => {
      const map = { ...(prev || {}) };
      if (Object.prototype.hasOwnProperty.call(map, next)) return map;
      map[next] = [];
      return map;
    });
    editing?.setEditedSplit?.(next);
  }, [getNextLetter, actions, editing]);

  // Relabel splits sequentially A,B,C... after a deletion
  const relabelSequential = useCallback((map, currentEditedKey) => {
    const keys = Object.keys(map).sort((a, b) =>
      String(a).localeCompare(String(b))
    );
    const newMap = {};
    let newEdited = null;

    keys.forEach((oldKey, idx) => {
      const newKey = ABC[idx] ?? oldKey;
      newMap[newKey] = map[oldKey];
      if (currentEditedKey === oldKey) newEdited = newKey;
    });

    if (!newEdited) newEdited = ABC[0] || keys[0] || "A";
    if (!newMap[newEdited]) newMap[newEdited] = newMap[newEdited] ?? [];

    return { newMap, newEdited };
  }, []);

  // Delete split from sheet
  const performDelete = useCallback(() => {
    const splitKey = sheetTarget;
    if (!splitKey) return;
    if ((splits?.length ?? 0) <= 1) {
      closeSheet();
      return;
    }
    actions?.setSelectedExercises?.((prev) => {
      const prevMap = { ...(prev || {}) };
      delete prevMap[splitKey];

      const { newMap, newEdited } = relabelSequential(
        prevMap,
        editing?.editedSplit
      );

      editing?.setEditedSplit?.(newEdited);
      return newMap;
    });
    closeSheet();
  }, [
    sheetTarget,
    splits?.length,
    actions,
    editing,
    relabelSequential,
    closeSheet,
  ]);

  // --- Tab components (refined look, same color palette) ---

  // Visual tab: subtle dual-tone + soft border to add depth while keeping colors
  const SplitTab = useCallback(
    ({ label, selected, onPressLabel, onOpenMenu }) => (
      <View
        style={{
          width: TAB_W,
          height: TAB_H,
          borderRadius: width * 0.04,
          backgroundColor: selected ? "#2979FF" : "rgb(234, 240, 246)",
          borderWidth: selected ? 0 : 1.5,
          borderColor: selected ? "transparent" : "rgba(0,0,0,0.06)",
          shadowColor: "#000",
          shadowOpacity: selected ? 0.12 : 0.06,
          shadowRadius: selected ? 6 : 4,
          elevation: selected ? 3 : 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top sheen bar for visual interest */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: Math.max(6, TAB_H * 0.08),
          }}
        />

        {/* Centered label area */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPressLabel}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: "Inter_700Bold",
              color: selected ? "white" : "#0F172A",
              textAlign: "center",
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>

        {/* Compact menu button (three-dot) with ghost/ghost-inverted */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onOpenMenu}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected
              ? "rgba(255,255,255,0.22)"
              : "rgba(0,0,0,0.05)",
          }}
        >
          <Text
            style={{
              fontSize: RFValue(16),
              fontFamily: "Inter_800ExtraBold",
              color: selected ? "white" : "#2979FF",
              lineHeight: 18,
            }}
          >
            ⋮
          </Text>
        </TouchableOpacity>
      </View>
    ),
    []
  );

  // Plus tab with same footprint
  const PlusTab = useCallback(
    () => (
      <TouchableOpacity
        onPress={handleAddSplit}
        activeOpacity={0.9}
        style={{
          width: TAB_W,
          height: TAB_H,
          borderRadius: width * 0.04,
          backgroundColor: "rgb(234, 240, 246)",
          borderWidth: 1.5,
          borderColor: "rgba(0,0,0,0.06)",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: RFValue(22),
            fontFamily: "Inter_800ExtraBold",
            color: "#2979FF",
            textAlign: "center",
            lineHeight: 24,
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    ),
    [handleAddSplit]
  );

  // Render each split
  const renderSplit = useCallback(
    ({ item }) => {
      const isSelected = item === editing?.editedSplit;
      return (
        <SplitTab
          label={item}
          selected={isSelected}
          onPressLabel={() => editing?.setEditedSplit?.(item)}
          onOpenMenu={() => openSheetFor(item)}
        />
      );
    },
    [editing?.editedSplit, editing, openSheetFor, SplitTab]
  );

  return (
    <View
      style={{
        flex: 2,
        alignItems: "flex-start",
        justifyContent: "center",
        width: "95%",
        marginLeft: width * 0.04,
      }}
    >
      <FlatList
        data={splits}
        keyExtractor={(item, index) => String(item ?? index)}
        horizontal
        renderItem={renderSplit}
        contentContainerStyle={{ paddingRight: width * 0.05 }}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: GAP_W }} />}
        ListFooterComponent={() => (
          <View style={{ marginLeft: GAP_W }}>
            <PlusTab />
          </View>
        )}
      />

      {/* Custom animated bottom sheet (backdrop fades, sheet slides only) */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        {/* Backdrop (fade only) */}
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            opacity: backdropOpacity,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={closeSheet} />
        </Animated.View>

        {/* Sheet (slides from bottom; backdrop stays put) */}
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            transform: [{ translateY: sheetY }],
            backgroundColor: "white",
            borderTopLeftRadius: SHEET_RADIUS,
            borderTopRightRadius: SHEET_RADIUS,
            paddingHorizontal: SHEET_PAD_H,
            paddingTop: SHEET_PAD_V * 0.6,
            paddingBottom: SHEET_PAD_V,
          }}
        >
          {/* Grab handle */}
          <View
            style={{
              alignSelf: "center",
              width: 46,
              height: 5,
              borderRadius: 2.5,
              backgroundColor: "rgba(0,0,0,0.12)",
              marginBottom: 12,
            }}
          />
          <Text
            style={{
              fontSize: RFValue(14),
              fontFamily: "Inter_700Bold",
              color: "#111",
              marginBottom: 10,
            }}
          >
            {`Split ${sheetTarget || ""}`}
          </Text>

          {/* Delete split (destructive) */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={performDelete}
            disabled={(splits?.length ?? 0) <= 1}
            style={{
              height: Math.max(48, height * 0.058),
              borderRadius: width * 0.03,
              backgroundColor:
                (splits?.length ?? 0) <= 1 ? "#EDEDED" : "#FF3B30",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(13),
                fontFamily: "Inter_700Bold",
                color: (splits?.length ?? 0) <= 1 ? "#8A8A8A" : "white",
              }}
            >
              Delete split
            </Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={closeSheet}
            style={{
              height: Math.max(46, height * 0.054),
              borderRadius: width * 0.03,
              borderWidth: 2,
              borderColor: "rgb(234, 240, 246)",
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontSize: RFValue(13),
                fontFamily: "Inter_700Bold",
                color: "#111",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default SplitTabsRow;
