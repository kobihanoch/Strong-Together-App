import React, { useMemo } from "react";
import { Dimensions, View, FlatList } from "react-native";
import { useCreateWorkout } from "../../context/CreateWorkoutContext";
import EditableSplitTab from "../../components/CreateWorkoutComponents/EditableSplitTab";

const { width, height } = Dimensions.get("window");

const SplitTabsRow = () => {
  // Pull split names from context
  const { userWorkout, editing } = useCreateWorkout();

  const splits = useMemo(
    () => userWorkout?.workoutSplits ?? [],
    [userWorkout?.workoutSplits]
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
        renderItem={({ item }) => (
          <EditableSplitTab
            splitObj={item}
            isSelected={item === editing?.editedSplit}
          />
        )}
        contentContainerStyle={{ paddingRight: width * 0.05 }}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: width * 0.05 }} />}
      />
    </View>
  );
};

export default SplitTabsRow;
