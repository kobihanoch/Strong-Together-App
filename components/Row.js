import React from "react";
import { View, StyleSheet } from "react-native";

const Row = ({ children, style, ...rest }) => {
  return (
    <View style={[styles.row, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Row;
