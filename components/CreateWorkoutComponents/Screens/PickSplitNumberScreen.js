import React from "react";
import { Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GradientedGoToButton from "../../GradientedGoToButton";
import WorkoutGenericBuildSettingsCard from "../PickSplitNumberScreenComponents/WorkoutGenericBuildSettingsCard";

const { width, height } = Dimensions.get("window");

function PickSplitNumberScreen({ setStep, setSplitsNumber }) {
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
          flex: 2,
          flexDirection: "column",
          gap: height * 0.01,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: RFValue(17),
            color: "white",
          }}
        >
          Create workout
        </Text>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(12),
            opacity: 0.5,
            color: "white",
          }}
        >
          At first, we would like to know how many splits you want to have.
        </Text>
      </View>
      <View style={{ flex: 6 }}>
        <WorkoutGenericBuildSettingsCard setSplitsNumber={setSplitsNumber} />
      </View>
      <View style={{ flex: 2, alignItems: "center" }}>
        <View style={{ width: "50%" }}>
          <GradientedGoToButton
            gradientColors={["#FF9500", "#FF6B00"]}
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
                  fontFamily: "Inter_700Bold",
                  color: "white",
                  fontSize: RFValue(15),
                }}
              >
                Next step
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

export default PickSplitNumberScreen;
