import React from "react";
import { View, StyleSheet } from "react-native";

const Column = ({ children, style, ...rest }) => {
  return (
    <View style={[styles.column, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: "column",
  },
});

export default Column;
