import React, { useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const SelectField = ({
  value,
  onChange,
  iconName = "venus-mars",
  placeholder = "Gender (Optional)",
  options = ["Male", "Female"],
}) => {
  // Local state for dropdown open/close
  const [open, setOpen] = useState(false);

  // Label to show in the closed state
  const label = useMemo(() => value || placeholder, [value, placeholder]);

  // Toggle dropdown open/close
  const toggle = () => setOpen((v) => !v);

  // Select an option and close
  const select = (opt) => {
    onChange?.(opt);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      {/* Field (closed state look) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggle}
        style={styles.inputContainer}
      >
        <Text
          style={[
            styles.valueText,
            !value && styles.placeholderText, // dim color when placeholder
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>

        {/* Right side icons: gender icon + dropdown chevron */}
        <View style={styles.rightIcons}>
          {/*<MaterialCommunityIcons
            name={iconName ?? null}
            size={RFValue(15)}
            color={"white"}
          />*/}
          <MaterialCommunityIcons
            name={open ? "chevron-up" : "chevron-down"}
            size={RFValue(15)}
            color={"white"}
          />
        </View>
      </TouchableOpacity>

      {/* Dropdown menu */}
      {open && (
        <>
          {/* Tap outside to close */}
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>

          <View style={styles.dropdown}>
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => select(opt)}
                  style={[
                    styles.optionRow,
                    selected && styles.optionRowSelected,
                  ]}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                  {selected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={RFValue(15)}
                      color="#004fa3"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

const BOX_WIDTH = width * 0.5;

const styles = StyleSheet.create({
  wrapper: {
    width: BOX_WIDTH,
    marginVertical: height * 0.01,
    // zIndex to ensure dropdown renders above neighbors (Android needs this)
    zIndex: 10,
  },
  inputContainer: {
    // Same visual language as your InputField
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: height * 0.013,
    backgroundColor: "transparent",
    width: "100%",
  },
  valueText: {
    flex: 1,
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: width * 0.04,
    textAlign: "left",
  },
  placeholderText: {
    color: "#e0efffff", // slightly dimmed
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  // Full-screen overlay to catch outside taps
  overlay: {
    position: "absolute",
    top: -height, // extend far enough
    left: -width,
    right: -width,
    bottom: -height,
  },

  // Dropdown panel below the field
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "rgba(255, 255, 255, 1)", // translucent over gradient
    backdropFilter: "blur(2px)", // harmless on RN web; ignored native
    overflow: "hidden",
  },
  optionRow: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionRowSelected: {
    backgroundColor: "#e0efff",
  },
  optionText: {
    fontFamily: "Inter_400Regular",
    fontSize: width * 0.04,
    color: "#004fa3",
  },
  optionTextSelected: {
    color: "#004fa3",
    fontWeight: "bold",
  },
});

export default SelectField;
