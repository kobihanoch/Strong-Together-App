import React from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import ExerciseCard from "./ExerciseCard";

const { width, height } = Dimensions.get("window");

const ExercisesFlatList = ({ data, dataToCompare, exerciseTracking }) => {
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
              exerciseTracking={exerciseTracking}
            ></ExerciseCard>
          )}
          contentContainerStyle={{ padding: 10 }}
        />
      ) : (
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            color: "black",
            fontSize: RFValue(18),
          }}
        >
          REST DAY
        </Text>
      )}
    </View>
  );
};

export default ExercisesFlatList;
