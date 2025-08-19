// English comments only inside code

import React from "react";
import { Dimensions, Text, View, Pressable, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const BTN_H = Math.max(48, height * 0.058);
const RADIUS = width * 0.035;

// Reusable primary button (filled)
const PrimaryButton = ({ title, onPress, disabled, rightIconName }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: "rgba(255,255,255,0.18)" }}
      style={({ pressed }) => ({
        flex: 1,
        height: BTN_H,
        borderRadius: RADIUS,
        backgroundColor: disabled ? "#9BB9FF" : "#2979FF",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row", // place text + icon in a row
        gap: 6,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      {/* Text first */}
      <Text
        style={{
          fontSize: RFValue(14),
          color: "white",
          fontFamily: "Inter_700Bold",
        }}
      >
        {title}
      </Text>

      {/* Icon after text (on the right) */}
      {rightIconName ? (
        <MaterialCommunityIcons
          name={rightIconName}
          size={RFValue(16)}
          color="white"
          style={{ marginLeft: 2 }}
        />
      ) : null}
    </Pressable>
  );
};

// Reusable secondary button (ghost/soft)
const SecondaryButton = ({ title, onPress, disabled, loading }) => {
  const isDisabled = !!disabled || !!loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: "rgba(41,121,255,0.08)" }}
      style={({ pressed }) => ({
        paddingHorizontal: width * 0.04,
        height: BTN_H,
        borderRadius: RADIUS,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: isDisabled
          ? "#EEF3FF"
          : pressed
          ? "rgba(41,121,255,0.06)"
          : "rgba(41,121,255,0.04)",
        borderWidth: 2,
        borderColor: isDisabled ? "#CFE0FF" : "#BFD3FF",
        transform: [{ scale: pressed ? 0.985 : 1 }],
        minWidth: Platform.OS === "ios" ? width * 0.36 : undefined,
        flexDirection: "row",
      })}
    >
      <Text
        style={{
          fontSize: RFValue(14),
          color: isDisabled ? "#6B7A90" : "#2979FF",
          fontFamily: "Inter_700Bold",
        }}
      >
        {loading ? "Saving..." : title}
      </Text>
    </Pressable>
  );
};

// Action bar with spacing and paddings
const ActionButtons = ({ onAdd, onSave, saving, disableSave = false }) => {
  return (
    <View
      style={{
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.012,
        flexDirection: "row",
        gap: width * 0.03,
      }}
    >
      <PrimaryButton
        title="Add exercise"
        onPress={onAdd}
        disabled={false}
        rightIconName="plus" // white plus icon on the right
      />
      <SecondaryButton
        title="Save workout"
        onPress={onSave}
        disabled={!!disableSave}
        loading={!!saving}
      />
    </View>
  );
};

export default ActionButtons;
