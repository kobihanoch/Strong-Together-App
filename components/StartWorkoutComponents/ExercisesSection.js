import React, { useCallback, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Row from "../Row";
import PercantageCircle from "../PercentageCircle";
import { colors } from "../../constants/colors";
import PageDots from "../PageDots";
import Column from "../Column";

const { width, height } = Dimensions.get("window");

const RenderItem = ({ item, exercisesSetsDoneMap }) => {
  const { planned: setsToDo, done: setsDone } =
    exercisesSetsDoneMap[item.exercise];
  const exProgress = Math.floor((setsDone / setsToDo) * 100);

  console.log({ setsToDo, setsDone });
  return (
    <View style={styles.itemCard}>
      <Row style={{ gap: 10 }}>
        <PercantageCircle
          percent={exProgress}
          actualColor={colors.primary}
          stroke={4}
        >
          <Text style={styles.pctText}>{exProgress + "%"}</Text>
        </PercantageCircle>
        <Column>
          <Text style={styles.itemExerciseName}>{item.exercise}</Text>
          <Text style={styles.itemSetIndicatorText}>
            {setsDone + " of " + setsToDo + " completed"}
          </Text>
        </Column>

        <Column
          style={{
            marginLeft: "auto",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <PageDots
            length={setsToDo}
            index={setsDone}
            fillColor={"#12c282ff"}
            fillToIndex={true}
            activeColor={colors.primary}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Set {setsDone + 1}</Text>
          </View>
        </Column>
      </Row>
    </View>
  );
};

const ExercisesSection = ({ exercises, exercisesSetsDoneMap }) => {
  return (
    <FlatList
      data={exercises}
      renderItem={({ item }) => {
        return (
          <RenderItem item={item} exercisesSetsDoneMap={exercisesSetsDoneMap} />
        );
      }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  itemCard: {
    height: height * 0.5,
    alignSelf: "center",
    width: "90%",
    borderRadius: 16,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 50,
    shadowColor: "#585858ff",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    // Android shadow
    elevation: 6,
  },
  itemExerciseName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(13),
    color: "black",
  },
  itemSetIndicatorText: {
    fontFamily: "Inter_400Refular",
    fontSize: RFValue(12),
    color: colors.textSecondary,
  },
  pctText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.lightCardBg,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(10),
    color: colors.primary,
  },
});

export default ExercisesSection;
