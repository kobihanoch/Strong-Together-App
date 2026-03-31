import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

interface ColumnProps extends ViewProps {
  children?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ children, style, ...rest }) => {
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