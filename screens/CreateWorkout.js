// English comments only inside code

// CreateWorkout.js - Manages overall workout creation and state
import React, { useCallback, useMemo } from "react";
import { Dimensions, View, Text, FlatList } from "react-native";
import {
  CreateWorkoutProvider,
  useCreateWorkout,
} from "../context/CreateWorkoutContext";
import EditableSplitTab from "../components/CreateWorkoutComponents/EditableSplitTab";
import PickExerciseItem from "../components/CreateWorkoutComponents/AddExercisesScreenComponents/PickExerciseItem";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  return (
    <CreateWorkoutProvider>
      <InnerCreateWorkout />
    </CreateWorkoutProvider>
  );
}

const InnerCreateWorkout = () => {
  // Pull from your context (matches your provider shape)
  const { properties, userWorkout, editing, actions } = useCreateWorkout();

  // Always provide an array to the list
  const data = useMemo(
    () => editing?.selectedExercises?.[editing?.editedSplit] ?? [],
    [editing?.selectedExercises, editing?.editedSplit]
  );

  // Reorder handler: persist new order AND rewrite order_index by new position
  const handleDragEnd = useCallback(
    ({ data: newOrder }) => {
      if (!editing?.editedSplit) return;

      // Rewrite order_index as 1-based (use i instead of i+1 if you want 0-based)
      const reindexed = newOrder.map((ex, i) => ({
        ...ex,
        order_index: i, // <-- change to i for 0-based ordering
      }));

      actions?.setSelectedExercises?.((prev) => ({
        ...prev,
        [editing.editedSplit]: reindexed,
      }));
    },
    [editing?.editedSplit, actions]
  );

  // Render each exercise and wire drag to the left handle
  const renderItem = useCallback(
    ({ item, drag }) => {
      return (
        <ScaleDecorator activeScale={0.98}>
          <PickExerciseItem
            exercise={item}
            dragHandleProps={{
              onLongPress: drag,
              delayLongPress: 120,
            }}
            onDelete={(ex) => {
              actions?.setSelectedExercises?.((prev) => {
                const list = prev?.[editing?.editedSplit] ?? [];
                const filtered = list.filter((e) => e.id !== ex.id);

                // After delete, also normalize order_index to keep it sequential
                const reindexed = filtered.map((it, i) => ({
                  ...it,
                  order_index: i + 1, // match the same convention
                }));

                return { ...prev, [editing.editedSplit]: reindexed };
              });
            }}
          />
        </ScaleDecorator>
      );
    },
    [editing?.editedSplit, actions]
  );

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: height * 0.02,
        backgroundColor: "transparent",
      }}
    >
      {properties?.hasWorkout ? (
        <View style={{ flex: 1, alignItems: "stretch" }}>
          {/* Splits row (not draggable) */}
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
              data={userWorkout?.workoutSplits ?? []} // array of split names (e.g., ["A","B","C"])
              keyExtractor={(item, index) => String(item ?? index)}
              horizontal
              renderItem={({ item }) => (
                <EditableSplitTab
                  splitObj={item}
                  isSelected={item === editing?.editedSplit}
                />
              )}
              contentContainerStyle={{ paddingRight: width * 0.05 }}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View style={{ width: width * 0.05 }} />
              )}
            />
          </View>

          {/* Selected exercises list (draggable + order_index rewrite) */}
          <View style={{ flex: 7 }}>
            {data.length === 0 ? (
              <Text
                style={{ opacity: 0.6, textAlign: "center", marginTop: 24 }}
              >
                No exercises
              </Text>
            ) : (
              <DraggableFlatList
                data={data}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                onDragEnd={handleDragEnd}
                activationDistance={12}
                autoscrollThreshold={60}
                autoscrollSpeed={250}
                containerStyle={{ flexGrow: 1 }}
                contentContainerStyle={{ paddingBottom: 12 }}
                initialNumToRender={10}
                windowSize={7}
                removeClippedSubviews
                alwaysBounceVertical={false}
              />
            )}
          </View>
        </View>
      ) : (
        <View>
          <Text>Doesn't have workout</Text>
        </View>
      )}
    </View>
  );
};

export default CreateWorkout;

/*
  IMPORTANT:
  - Ensure the left drag handle in PickExerciseItem is Pressable, not View:

    <Pressable {...(dragHandleProps || {})} style={styles.dragHandle}>
      <MaterialCommunityIcons name="drag-vertical" size={RFValue(16)} color="rgba(0,0,0,0.35)" />
    </Pressable>

  - order_index convention:
    Currently set to 1-based (i + 1). If you need 0-based for your DB, change to (i).
*/
