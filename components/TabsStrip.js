import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../constants/colors";
import SegmentedControl from "react-native-segmented-control-2";

const { width, height } = Dimensions.get("window");

const TabsStrip = ({ style, array }) => {
  const [index, setIndex] = useState(0);
  return (
    <SegmentedControl
      style={style}
      tabs={array}
      onChange={setIndex}
      value={index}
      tabStyle={{ height: 40 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: height * 0.02,
    height: height * 0.07,
    backgroundColor: colors.lightCardBg,
    borderRadius: 16,
  },
});

export default TabsStrip;
