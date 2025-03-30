import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const ExercisesFlatList = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={{ fontFamily: "PoppinsBold", fontSize: RFValue(15) }}>
        {item.exercise}
      </Text>
      <View
        style={{ flexDirection: "row", gap: width * 0.05, alignSelf: "center" }}
      >
        {item.weight.map((w, index) => (
          <View
            key={index}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "red",
              padding: height * 0.01,
              borderRadius: height * 0.01,
              width: width * 0.2,
            }}
          >
            <Text style={{ fontFamily: "PoppinsBold", fontSize: RFValue(15) }}>
              Set {index + 1}
            </Text>
            <Text
              style={{ fontFamily: "PoppinsRegular", fontSize: RFValue(13) }}
            >
              {w} kg
            </Text>
            <Text
              style={{ fontFamily: "PoppinsRegular", fontSize: RFValue(13) }}
            >
              {item.reps[index]} reps
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 7, justifyContent: "center", alignItems: "center" }}>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
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
    gap: height * 0.08,
    borderRadius: height * 0.02,
  },
});

export default ExercisesFlatList;
