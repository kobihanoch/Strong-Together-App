import React from "react";
import { Dimensions, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import WorkoutSplitItem from "./WorkoutSplitItem";

const { width, height } = Dimensions.get("window");

const WorkoutSplitsList = ({ data }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        width: "90%",
      }}
    >
      <FlatList
        data={data.workoutSplits}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        ItemSeparatorComponent={() => <View style={{ width: width * 0.02 }} />}
        renderItem={({ item }) => (
          <WorkoutSplitItem
            item={item}
            isSelected={item.id === data.selectedSplit?.id}
            onPress={() => data.handleWorkoutSplitPress(item)}
          />
        )}
      />
    </View>
  );
};

export default WorkoutSplitsList;
