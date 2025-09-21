import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Column from "../Column";
import Row from "../Row";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../constants/colors";
import { TextInput } from "react-native-gesture-handler";
import NumericInputWithRules from "../StartWorkoutComponents/NumericInputWithRules";
import { Notifier, NotifierComponents } from "react-native-notifier";

const { height, width } = Dimensions.get("window");

const RenderItem = ({
  item,
  drag,
  removeExercise,
  updateSets,
  selectedSplit,
}) => {
  const exNumber = item.order_index + 1;
  const [setsChose, setSetsChose] = useState(3);
  const [setsArr, setSetsArr] = useState(item?.sets);

  useEffect(() => {
    updateSets(item, setsArr);
  }, [setsArr]);

  const handleChangeAt = (idx) => (val) => {
    // val is the parsed number from commit()
    setSetsArr((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleRemoveExercise = (ex) => {
    removeExercise(ex);

    Notifier.showNotification({
      title: "Exercise Removed",
      description: `"${ex?.name}" removed from Split ${selectedSplit}`,
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
  };

  const renderSetsChoose = [];
  for (let i = 0; i < 5; i++) {
    const isSetChose = i + 1 <= setsChose;
    renderSetsChoose.push(
      <TouchableOpacity
        style={[
          styles.setContainer,
          isSetChose ? { backgroundColor: colors.primary } : {},
        ]}
        key={i}
        onPress={() => {
          const n = i + 1;
          setSetsChose(n);
          setSetsArr((prev) => {
            const arr = Array.isArray(prev) ? [...prev] : [];
            for (let j = 0; j < n; j++) {
              if (arr[j] == null) arr[j] = 10;
            }
            arr.length = n;
            return arr;
          });
        }}
      >
        <Text style={[styles.setText, , isSetChose ? { color: "white" } : {}]}>
          {i + 1}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScaleDecorator activeScale={0.98}>
      <Column style={styles.exerciseItemContainer}>
        <Row style={{ gap: 10, alignItems: "center" }}>
          <Pressable
            onLongPress={drag}
            delayLongPress={120}
            style={styles.heandleDrag}
          >
            <MaterialCommunityIcons
              name={"drag"}
              size={RFValue(20)}
              color={"black"}
              opacity={0.4}
            ></MaterialCommunityIcons>
          </Pressable>
          <Column style={{ gap: 2 }}>
            <Text style={styles.exerciseHeader}>
              {item.name},{" "}
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  color: colors.textSecondary,
                  fontSize: RFValue(12),
                  opacity: 0.7,
                }}
              >
                {item?.targetmuscle}
              </Text>
            </Text>
            <Text style={styles.exerciseCount}>Exercise {exNumber}</Text>
          </Column>
          <TouchableOpacity
            style={{ marginLeft: "auto" }}
            onPress={() => handleRemoveExercise(item)}
          >
            <MaterialCommunityIcons
              name={"close"}
              size={RFValue(15)}
              color={"black"}
              opacity={0.4}
            ></MaterialCommunityIcons>
          </TouchableOpacity>
        </Row>
        <Column style={styles.setsSectionContainer}>
          <Row style={{ alignItems: "flex-start" }}>
            <Column style={{ gap: 10 }}>
              <Text style={styles.setsHeader}>Choose sets amount</Text>
              <Row style={{ gap: 5 }}>{renderSetsChoose}</Row>
            </Column>
            <Text style={styles.setsChoseText}>
              {setsChose + " " + (setsChose === 1 ? "set" : "sets")}
            </Text>
          </Row>
          <Text style={styles.setsHeader}>Reps (Tap to edit)</Text>
          <Row
            style={{ gap: 5, justifyContent: "flex-start", flexWrap: "wrap" }}
          >
            {setsArr.map((set, i) => {
              return (
                <Column style={styles.setInputContainer} key={i}>
                  <Row style={{ gap: 10 }}>
                    <Text style={{ fontSize: RFValue(10), opacity: 0.4 }}>
                      S{i + 1}
                    </Text>
                    <NumericInputWithRules
                      initial={set || 10}
                      allowZero={false}
                      isSetLocked={false}
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        fontSize: RFValue(11),
                      }}
                      onValidChange={handleChangeAt(i)}
                      commitOnInitial={true}
                    />
                  </Row>
                </Column>
              );
            })}
          </Row>
        </Column>
      </Column>
    </ScaleDecorator>
  );
};

const SelectedExercisesList = ({ exForSplit, controls, selectedSplit }) => {
  const { removeExercise, onDragEnd, updateSets } = controls || {};
  // Render item with drag handle wired to the left handle
  const renderItem = useCallback(
    ({ item, drag }) => (
      <RenderItem
        item={item}
        drag={drag}
        removeExercise={removeExercise}
        updateSets={updateSets}
        selectedSplit={selectedSplit}
      />
    ),
    [removeExercise]
  );
  if (exForSplit.length === 0) {
    return (
      <View style={{ flex: 7, justifyContent: "center" }}>
        <Text style={{ opacity: 0.6, textAlign: "center", marginTop: 24 }}>
          No selected exercises yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 7 }}>
      <DraggableFlatList
        data={exForSplit}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onDragEnd={onDragEnd}
        activationDistance={12}
        autoscrollThreshold={60}
        autoscrollSpeed={250}
        containerStyle={{ flexGrow: 1 }}
        // Add a bit of extra bottom padding so the last input clears the keyboard
        contentContainerStyle={{ paddingBottom: 150 }}
        initialNumToRender={10}
        removeClippedSubviews
        alwaysBounceVertical={false}
        // Important so taps on TextInputs are not swallowed by the list
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseItemContainer: {
    shadowColor: "#000000ff",
    shadowOpacity: 0.07,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    // Android shadow
    elevation: 6,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 10,
  },
  heandleDrag: {
    backgroundColor: "#f3f3f3ff",
    paddingVertical: 5,
    paddingHorizontal: 2,
    borderRadius: 10,
  },
  exerciseHeader: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(13),
    color: "black",
  },
  exerciseCount: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(10),
    color: colors.textSecondary,
  },
  setsSectionContainer: {
    backgroundColor: "#f3f3f3ff",
    padding: 15,
    marginTop: 10,
    borderRadius: 16,
    gap: 10,
  },
  setsHeader: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(12),
    color: colors.textSecondary,
  },
  setContainer: {
    height: 30,
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  setText: {
    fontFamily: "Inter_400Regular",
    color: "black",
  },
  setInputContainer: {
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 10,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    gap: 5,
  },
  setsChoseText: {
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(12),
    color: colors.primary,
    marginLeft: "auto",
  },
});

export default SelectedExercisesList;
