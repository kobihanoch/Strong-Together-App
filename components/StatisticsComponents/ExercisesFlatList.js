import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ExerciseCard from "./ExerciseCard";

const { width, height } = Dimensions.get("window");

const ExercisesFlatList = ({ data, dataToCompare }) => {
  return (
    <View style={{ flex: 7, justifyContent: "center", alignItems: "center" }}>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExerciseCard
              item={item}
              dataToCompare={dataToCompare}
            ></ExerciseCard>
          )}
          contentContainerStyle={{ padding: 10 }}
        />
      ) : (
        <Text
          style={{
            fontFamily: "PoppinsBold",
            color: "white",
            fontSize: RFValue(18),
          }}
        >
          REST DAY
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginRight: width * 0.05,
    backgroundColor: "#f5f5f5",
    width: width * 0.75,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    gap: height * 0.02,
    borderRadius: height * 0.02,
  },
});

export default ExercisesFlatList;
