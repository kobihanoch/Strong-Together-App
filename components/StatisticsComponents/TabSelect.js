import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SegmentedControl from "react-native-segmented-control-2";
import { colors } from "../../constants/colors";
import Row from "../Row";

const { width, height } = Dimensions.get("window");

const TabSelect = ({ index, setIndex }) => {
  return (
    <View style={styles.sectionListContainer}>
      <SegmentedControl
        style={{
          width: "100%",
          backgroundColor: "transparent",
          flex: 1,
        }}
        tabs={[
          <Row style={styles.tabContainer}>
            <MaterialCommunityIcons
              name={"dumbbell"}
              size={RFValue(13)}
              color={"white"}
              backgroundColor={"#06B6D4"}
              borderRadius={10}
              paddingHorizontal={5}
              paddingVertical={5}
            />
            <Text style={styles.textStyle}>Exercises</Text>
          </Row>,
          <Row style={styles.tabContainer}>
            <MaterialCommunityIcons
              name={"fire"}
              size={RFValue(13)}
              color={"white"}
              backgroundColor={"#ff2979"}
              borderRadius={10}
              paddingHorizontal={5}
              paddingVertical={5}
            />
            <Text style={styles.textStyle}>Cardio</Text>
          </Row>,
        ]}
        onChange={setIndex}
        value={index}
        textStyle={{ fontFamily: "Inter_400Regular" }}
        selectedTabStyle={{
          borderRadius: 16,
          backgroundColor: "white",
          shadowOpacity: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionListContainer: {
    backgroundColor: colors.lightCardBg,
    paddingVertical: 2,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 16,
    justifyContent: "center",
    height: height * 0.06,
  },
  tabContainer: {
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    gap: 20,
  },
  textStyle: {
    fontFamily: "Inter_400Regular",
    color: "black",
    fontSize: RFValue(13),
  },
});

export default TabSelect;
