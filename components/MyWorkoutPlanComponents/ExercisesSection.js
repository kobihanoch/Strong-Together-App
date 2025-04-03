import React from "react";
import {
  Dimensions,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import ExerciseItem from "./ExerciseItem";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ExercisesSection = ({ data }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 8,
        width: "90%",
        flexDirection: "column",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingRight: width * 0.01,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: RFValue(21),
            marginLeft: width * 0.04,
          }}
        >
          Workout {data?.selectedSplit?.name}
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(12),
            backgroundColor: "rgb(234, 240, 246)",
            borderRadius: height * 0.01,
            paddingHorizontal: width * 0.03,
            paddingVertical: height * 0.005,
            textAlign: "center",
            color: "#2563eb",
          }}
        >
          Completed x{data?.splitTrainedCount}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: RFValue(15),
          marginLeft: width * 0.04,
          marginTop: height * 0.005,
          width: "100%",
        }}
      >
        {data?.selectedSplit?.muscle_group.replace(/\s*\([^)]*\)/g, "")}
      </Text>
      <View style={{ flex: 1, marginTop: height * 0.02 }}>
        <View style={{ flex: 8.5 }}>
          <FlatList
            data={data.filteredExercises}
            showsVerticalScroll
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ExerciseItem exercise={item} />}
          />
        </View>
        <TouchableOpacity
          style={{
            width: "95%",
            backgroundColor: "#2979FF",
            flex: 1.5,
            marginBottom: height * 0.02,
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: height * 0.02,
          }}
          onPress={() =>
            navigation.navigate("StartWorkout", {
              workoutSplit: data.selectedSplit,
            })
          }
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: RFValue(15),
              color: "white",
            }}
          >
            Start workout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExercisesSection;
