import React, { useCallback, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const RenderItem = ({ item }) => {
  const setsToDo = item.sets.length;
  return (
    <View style={styles.itemCard}>
      <Text style={styles.itemExerciseName}>{item.exercise}</Text>
    </View>
  );
};

const ExercisesSection = ({ exercises }) => {
  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => {
        return <RenderItem item={item} />;
      }}
      style={{ flex: 1, backgroundColor: "red", marginTop: 50 }}
      ItemSeparatorComponent={<View style={{ marginTop: 50 }}></View>}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  itemCard: {
    height: height * 0.5,
    alignSelf: "center",
    width: "90%",
    borderRadius: 16,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  itemExerciseName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(20),
    color: "black",
  },
});

export default ExercisesSection;
