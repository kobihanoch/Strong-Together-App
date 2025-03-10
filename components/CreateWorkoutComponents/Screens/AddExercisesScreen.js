import React from "react";
import { View, Text, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ChooseExercisesCard from "../AddExercisesScreenComponents/ChooseExercisesCard";
import GradientedGoToButton from "../../GradientedGoToButton";

const { width, height } = Dimensions.get("window");

function AddExercisesScreen({ setStep, workoutSplitName, exercises }) {
  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        paddingHorizontal: width * 0.05,
      }}
    >
      <View
        style={{
          flex: 1.5,
          flexDirection: "column",
          gap: height * 0.01,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "PoppinsBold",
            fontSize: RFValue(17),
            color: "white",
          }}
        >
          Pick your exercises
        </Text>
        <Text
          style={{
            fontFamily: "PoppinsRegular",
            fontSize: RFValue(12),
            opacity: 0.5,
            color: "white",
          }}
        >
          Split {workoutSplitName}
        </Text>
      </View>
      <View style={{ flex: 7 }}>
        <ChooseExercisesCard
          workoutSplitName={workoutSplitName}
          exercises={exercises}
        />
      </View>
      <View
        style={{
          flex: 1.5,
          alignItems: "center",
          flexDirection: "row",
          gap: width * 0.04,
          justifyContent: "center",
        }}
      >
        <View style={{ width: "60%" }}>
          <GradientedGoToButton
            gradientColors={["rgb(0, 123, 47)", "rgb(0, 141, 40)"]}
            borderRadius={height * 0.1}
            onPress={() => setStep(2)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: width * 0.04,
                alignItems: "center",
                opacity: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  color: "white",
                  fontSize: RFValue(15),
                }}
              >
                Save split {workoutSplitName}
              </Text>
              <FontAwesome5 name="check" color="white" size={RFValue(17)} />
            </View>
          </GradientedGoToButton>
        </View>
      </View>
    </View>
  );
}

export default AddExercisesScreen;
