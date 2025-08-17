// English comments only inside code

import React from "react";
import { Dimensions, Text, View, Pressable, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
const BTN_H = Math.max(48, height * 0.058);
const RADIUS = width * 0.035;

// Reusable primary button (filled)
const PrimaryButton = ({ title, onPress, disabled }) => {
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
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <Text
        style={{
          fontSize: RFValue(14),
          color: "white",
          fontFamily: "Inter_700Bold",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

// Reusable secondary button (ghost/soft)
const SecondaryButton = ({ title, onPress, disabled, loading }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
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
        // soft background + subtle border
        backgroundColor: disabled
          ? "#EEF3FF"
          : pressed
          ? "rgba(41,121,255,0.06)"
          : "rgba(41,121,255,0.04)",
        borderWidth: 2,
        borderColor: disabled ? "#CFE0FF" : "#BFD3FF",
        transform: [{ scale: pressed ? 0.985 : 1 }],
        minWidth: Platform.OS === "ios" ? width * 0.36 : undefined,
      })}
    >
      <Text
        style={{
          fontSize: RFValue(14),
          color: disabled ? "#6B7A90" : "#2979FF",
          fontFamily: "Inter_700Bold",
        }}
      >
        {loading ? "Saving..." : title}
      </Text>
    </Pressable>
  );
};

// Action bar with spacing and paddings
const ActionButtons = ({ onAdd, onSave, saving }) => {
  return (
    <View
      style={{
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.012,
        flexDirection: "row",
        gap: width * 0.03,
      }}
    >
      <PrimaryButton title="Add exercise" onPress={onAdd} disabled={false} />
      <SecondaryButton
        title="Save workout"
        onPress={onSave}
        disabled={!!saving}
        loading={!!saving}
      />
    </View>
  );
};

export default ActionButtons;
