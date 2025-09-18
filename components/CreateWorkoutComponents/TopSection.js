import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../constants/colors";
import Row from "../Row";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Column from "../Column";
import { FlatList, ScrollView } from "react-native-gesture-handler";

const { height, width } = Dimensions.get("window");
const TopSection = ({
  hasWorkout,
  splitsList,
  setSelectedSplit,
  selectedSplit,
  exerciseCountMap,
  totalExercises,
  addSplit,
  removeSplit,
}) => {
  return (
    <Column style={styles.container}>
      <Row style={{ justifyContent: "space-between" }}>
        <TouchableOpacity style={styles.exitBtnContainer}>
          <MaterialCommunityIcons
            name={"close"}
            size={RFValue(14)}
            color={"#1A1A1A"}
          ></MaterialCommunityIcons>
          <Text style={styles.exitBtnText}>Exit</Text>
        </TouchableOpacity>
        <Column>
          <Text style={styles.headerText}>
            {hasWorkout ? "Edit workout" : "Create workout"}
          </Text>
          <Row style={{ gap: 10 }}>
            <Text style={styles.splitsCountText}>
              {splitsList.length} splits
            </Text>
            <Text style={styles.splitsCountText}>
              {totalExercises} exercises
            </Text>
          </Row>
        </Column>
        <TouchableOpacity style={styles.saveBtnContainer}>
          <MaterialCommunityIcons
            name={"check"}
            size={RFValue(14)}
            color={"white"}
          ></MaterialCommunityIcons>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </Row>

      {/* Splits Bar */}
      <Row
        style={{
          alignItems: "center",
          width: "100%",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingTop: 30, width: 20 }}
        >
          {splitsList.map((split) => {
            const isSelectedSplit = selectedSplit === split;
            const exCount = exerciseCountMap[split] ?? 0;
            return (
              <View style={{ overflow: "visible" }}>
                <TouchableOpacity
                  style={styles.splitsRemoveBtn}
                  onPress={() => removeSplit(split)}
                >
                  <MaterialCommunityIcons
                    name={"close"}
                    size={RFValue(12)}
                    color={"white"}
                  ></MaterialCommunityIcons>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedSplit(split)}
                  key={split}
                >
                  <Column
                    style={[
                      styles.splitsContainer,
                      isSelectedSplit
                        ? { backgroundColor: colors.primary }
                        : {},
                    ]}
                  >
                    <Text
                      style={[
                        styles.splitsText,
                        isSelectedSplit ? { color: "white" } : {},
                      ]}
                    >
                      {split}
                    </Text>
                    <Row style={{ gap: 5 }}>
                      <View
                        style={[
                          styles.dot,
                          isSelectedSplit ? { backgroundColor: "white" } : {},
                        ]}
                      ></View>
                      <Text
                        style={[
                          styles.exerciseCountText,
                          isSelectedSplit ? { color: "white" } : {},
                        ]}
                      >
                        {exCount}
                      </Text>
                    </Row>
                  </Column>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <TouchableOpacity style={styles.addSplitBtn} onPress={addSplit}>
          <MaterialCommunityIcons
            name={"plus"}
            size={RFValue(14)}
            color={colors.primaryDark}
          ></MaterialCommunityIcons>
        </TouchableOpacity>
      </Row>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.3,
    backgroundColor: colors.lightCardBg,
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(18),
  },
  exitBtnContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 7,
  },
  exitBtnText: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
    color: colors.textSecondary,
  },
  saveBtnContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    flexDirection: "row",
    borderRadius: 16,
    gap: 7,
  },
  saveBtnText: {
    fontSize: RFValue(12),
    fontFamily: "Inter_600SemiBold",
    color: "white",
  },
  splitsCountText: {
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
    fontSize: RFValue(12),
    alignSelf: "center",
  },
  splitsContainer: {
    height: height * 0.1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    gap: 7,
  },
  splitsRemoveBtn: {
    position: "absolute",
    aspectRatio: 1,
    top: -5,
    right: 0,
    height: 25,
    borderRadius: 20,
    backgroundColor: "grey",
    zIndex: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  splitsText: {
    fontFamily: "Inter_500Medium",
    color: "black",
    fontSize: RFValue(15),
  },
  dot: {
    height: 6,
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: "black",
  },
  exerciseCountText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(10),
  },
  addSplitBtn: {
    height: height * 0.09,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    opacity: 0.8,
    borderStyle: "dashed",
    borderWidth: 1.2,
    borderColor: colors.primaryDark,
    borderRadius: 16,
    marginTop: 30,
  },
});

export default TopSection;
