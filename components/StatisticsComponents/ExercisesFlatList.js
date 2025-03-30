import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const ExercisesFlatList = ({ data, dataToCompare }) => {
  const renderItem = ({ item }) => {
    const previousExercise = Array.isArray(dataToCompare)
      ? dataToCompare.find((prev) => prev.exercise_id == item.exercise_id)
      : null;
    console.log(JSON.stringify(previousExercise));

    return (
      <LinearGradient
        colors={["rgb(255, 255, 255)", "rgb(216, 234, 255)"]}
        style={styles.item}
      >
        <Text
          style={{ fontFamily: "PoppinsBold", fontSize: RFValue(15), flex: 1 }}
        >
          {item.exercise}
        </Text>

        <View style={{ flexDirection: "column", flex: 9 }}>
          <View
            style={{ flex: 4.5, flexDirection: "column", gap: height * 0.02 }}
          >
            <View>
              <Text>Current workout</Text>
            </View>
            {/* Current Workout */}
            <View
              style={{
                flexDirection: "row",
                gap: width * 0.05,
                alignSelf: "center",
                backgroundColor: "rgba(157, 157, 157, 0.17)",
                borderRadius: height * 0.02,
              }}
            >
              {item.weight.map((w, index) => {
                const prevWeight = previousExercise?.weight?.[index];
                const isImproved = prevWeight !== undefined && w > prevWeight;
                let color,
                  borderColor = "";
                if (prevWeight) {
                  color = isImproved ? "green" : "red";
                } else {
                  color = "black";
                }
                borderColor = color;

                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: height * 0.01,
                      borderRadius: height * 0.01,
                      width: width * 0.2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(15),
                        color,
                      }}
                    >
                      {w} kg
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(15),
                        color,
                      }}
                    >
                      {item.reps[index]} reps
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsBold",
                        fontSize: RFValue(15),
                        color,
                      }}
                    >
                      Set {index + 1}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                borderTopColor: "black",
                borderTopWidth: 1,
              }}
            >
              <Text></Text>
            </View>
          </View>
          <View
            style={{
              flex: 4.5,
              flexDirection: "column",
              gap: height * 0.02,
            }}
          >
            <Text>Previuos workout</Text>
            {/* Prev Workout */}
            {previousExercise ? (
              <View
                style={{
                  flexDirection: "row",
                  gap: width * 0.05,
                  alignSelf: "center",
                }}
              >
                {previousExercise.weight.map((w, index) => (
                  <View
                    key={`prev-${index}`}
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: height * 0.01,
                      borderRadius: height * 0.01,
                      width: width * 0.2,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "PoppinsBold",
                        fontSize: RFValue(15),
                        color: "black",
                      }}
                    >
                      Set {index + 1}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(13),
                        color: "black",
                      }}
                    >
                      {w} kg
                    </Text>
                    <Text
                      style={{
                        fontFamily: "PoppinsRegular",
                        fontSize: RFValue(13),
                        color: "black",
                      }}
                    >
                      {previousExercise.reps[index]} reps
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: RFValue(13),
                    color: "black",
                    alignSelf: "center",
                  }}
                >
                  Not tracked last workout
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  };

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
    gap: height * 0.02,
    borderRadius: height * 0.02,
  },
});

export default ExercisesFlatList;
