import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import TopComponent from "../components/TopComponent";

const { width, height } = Dimensions.get("window");

const Theme1 = ({ children, header, lowerPartColor = "white" }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, backgroundColor: "blue" }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  lowerPart: {
    flex: 7,
    position: "absolute",
    top: height * 0.14,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopRightRadius: height * 0.0,
    borderTopLeftRadius: height * 0.0,
    overflow: "hidden",
  },
});

export default Theme1;
