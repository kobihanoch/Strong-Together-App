import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const StepperInput = ({
  value,
  onChange,
  min = 0,
  step = 1,
  max = 100,
  unit = "",
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, (parseInt(value) || 0) - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, (parseInt(value) || 0) + step);
    onChange(newValue);
  };

  const handleTextChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    const parsed = parseInt(cleaned);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: height * 0.05,
        borderWidth: 1.2,
        borderColor: "#2979FF",
        borderRadius: width * 0.025,
        overflow: "hidden",
        backgroundColor: "#f4f6f8",
      }}
    >
      <TouchableOpacity
        onPress={handleDecrease}
        style={{
          backgroundColor: "rgb(234, 240, 246)",
          paddingHorizontal: width * 0.03,
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(18),
            color: "#2563eb",
            fontFamily: "Inter_600SemiBold",
          }}
        >
          -
        </Text>
      </TouchableOpacity>

      <TextInput
        value={value.toString()}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        style={{
          flex: 1,
          height: "100%",
          textAlign: "center",
          fontSize: RFValue(14),
          fontFamily: "Inter_400Regular",
          backgroundColor: "#fff",
        }}
      />

      <TouchableOpacity
        onPress={handleIncrease}
        style={{
          backgroundColor: "rgb(234, 240, 246)",
          paddingHorizontal: width * 0.03,
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(18),
            color: "#2563eb",
            fontFamily: "Inter_600SemiBold",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StepperInput;
