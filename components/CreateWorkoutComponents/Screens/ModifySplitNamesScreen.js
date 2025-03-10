import React from "react";
import { View, Text, Dimensions } from "react-native";
import ModifySplitNamesCard from "./ModifySplitNamesScreenComponents/ModifySplitNamesCard";
import { RFValue } from "react-native-responsive-fontsize";
import GradientedGoToButton from "../../GradientedGoToButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import useExercises from "../../../hooks/useExercises";

const { width, height } = Dimensions.get("window");

function ModifySplitNamesScreen({
  setStep,
  splitsNumber,
  setEditWorkoutSplitName,
}) {
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
          Manage your workout plan
        </Text>
        <Text
          style={{
            fontFamily: "PoppinsRegular",
            fontSize: RFValue(12),
            opacity: 0.5,
            color: "white",
          }}
        >
          Add exercises to create the best plan out there!
        </Text>
      </View>
      <View style={{ flex: 7 }}>
        <ModifySplitNamesCard
          splitsNumber={splitsNumber}
          setEditWorkoutSplitName={setEditWorkoutSplitName}
          setStep={setStep}
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
        <View style={{ width: "30%" }}>
          <GradientedGoToButton
            gradientColors={["#FF9500", "#FF6B00"]}
            borderRadius={height * 0.1}
            onPress={() => setStep(1)}
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
              <FontAwesome5
                name="arrow-left"
                color="white"
                size={RFValue(17)}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  color: "white",
                  fontSize: RFValue(15),
                }}
              >
                Back
              </Text>
            </View>
          </GradientedGoToButton>
        </View>
        <View style={{ width: "30%" }}>
          <GradientedGoToButton
            gradientColors={["#FF9500", "#FF6B00"]}
            borderRadius={height * 0.1}
            onPress={() => setStep(3)}
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
                Next
              </Text>
              <FontAwesome5
                name="arrow-right"
                color="white"
                size={RFValue(17)}
              />
            </View>
          </GradientedGoToButton>
        </View>
      </View>
    </View>
  );
}

export default ModifySplitNamesScreen;
