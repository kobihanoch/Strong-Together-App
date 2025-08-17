// English comments only inside code

import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import PickExerciseItem from "../../components/CreateWorkoutComponents/PickExerciseItem";
import { useCreateWorkout } from "../../context/CreateWorkoutContext";

const SelectedExercisesList = () => {
  // Pull what we need from context
  const { editing, actions } = useCreateWorkout();

  // Always provide an array for the active split
  const data = useMemo(
    () => editing?.selectedExercises?.[editing?.editedSplit] ?? [],
    [editing?.selectedExercises, editing?.editedSplit]
  );

  // Reorder handler: persist new order AND rewrite order_index (0-based)
  const handleDragEnd = useCallback(
    ({ data: newOrder }) => {
      if (!editing?.editedSplit) return;

      const reindexed = newOrder.map((ex, i) => ({
        ...ex,
        order_index: i, // 0-based index
      }));

      actions?.setSelectedExercises?.((prev) => ({
        ...prev,
        [editing.editedSplit]: reindexed,
      }));
    },
    [editing?.editedSplit, actions]
  );

  // Render item with drag handle wired to the left handle
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

                // Normalize order_index after delete (0-based)
                const reindexed = filtered.map((it, i) => ({
                  ...it,
                  order_index: i,
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

  if (data.length === 0) {
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
    </View>
  );
};

export default SelectedExercisesList;
