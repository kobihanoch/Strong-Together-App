import moment from "moment-timezone";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../constants/colors";
import useGenerateDays from "../../hooks/useGenerateDays";
import Row from "../Row";

const { width, height } = Dimensions.get("window");
// Use fixed item math so FlatList can jump directly to the right index
const ITEM_W = width * 0.18;
const ITEM_GAP = width * 0.02;
const ITEM_LEN = ITEM_W + ITEM_GAP;

const CalendarStripCustom = ({
  onDateSelect,
  selectedDate,
  userExerciseLogs,
}) => {
  const { datesList } = useGenerateDays();
  const timezone = "Asia/Jerusalem";

  const handleDatePress = (date) => {
    onDateSelect &&
      onDateSelect(date.clone().tz(timezone).format("YYYY-MM-DD"));
  };

  const selectedDateMoment = useMemo(
    () => moment.tz(selectedDate, "YYYY-MM-DD", timezone),
    [selectedDate]
  );

  // Compute initialScrollIndex so the list renders at the selected day without a visible jump
  const initialScrollIndex = useMemo(() => {
    if (!datesList || !selectedDate) return undefined;
    const idx = datesList.findIndex((d) => d.isSame(selectedDate, "day"));
    return idx;
  }, [datesList, selectedDateMoment]);

  // Small memo to avoid moment() per-item for "today"
  const today = useMemo(() => moment.tz(timezone), []);

  // Initae with current month of today's date
  const [currentMonth, setCurrentMonth] = useState(
    moment().format("MMMM YYYY")
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems?.length) return;
    // Use the first (or center) visible item to derive current month
    const firstMoment = viewableItems[0]?.item;
    if (firstMoment) {
      setCurrentMonth(firstMoment.format("MMMM YYYY"));
    }
  }).current;

  // Emable scrolling for today by pressing a button
  const flatListRef = useRef(null);
  const scrollToToday = useCallback(() => {
    if (!flatListRef) return;
    const todayIndex = datesList.findIndex((d) => d.isSame(today, "day"));
    flatListRef.current.scrollToIndex({ index: todayIndex, animated: true });
    onDateSelect(today.format("YYYY-MM-DD"));
  }, [initialScrollIndex, flatListRef]);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item.isSame(selectedDateMoment, "day");
      const isToday = item.isSame(today, "day");

      const dateKey = item.format("YYYY-MM-DD");
      let workoutLogForDate = null;

      // If performance here ever becomes an issue, convert to a map outside.

      workoutLogForDate = userExerciseLogs[dateKey];

      const splitName = workoutLogForDate?.[0].splitname;

      return (
        <TouchableOpacity
          style={[styles.dateItem, isSelected && styles.selectedItem]}
          onPress={() => handleDatePress(item)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.dayName,
              isSelected
                ? styles.selectedText
                : isToday
                ? styles.todayText
                : null,
            ]}
          >
            {item.format("dd")}
          </Text>
          <Text
            style={[
              styles.dayNumber,
              isSelected
                ? styles.selectedText
                : isToday
                ? styles.todayText
                : null,
            ]}
          >
            {item.format("D")}
          </Text>

          {splitName ? (
            <Text
              style={{
                fontSize: RFValue(13),
                color: isSelected ? "white" : "black",
                backgroundColor: isSelected
                  ? "transparent"
                  : "rgba(234, 240, 246, 0)",
                padding: height * 0.01,
                borderRadius: height * 0.04,
                fontFamily: "Inter_400Regular",
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {splitName}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: RFValue(13),
                color: isSelected ? "white" : "black",
                fontFamily: "Inter_400Regular",
                padding: height * 0.01,
                textAlign: "center",
                opacity: isSelected ? 1 : 0.2,
              }}
              numberOfLines={1}
            >
              Rest
            </Text>
          )}
        </TouchableOpacity>
      );
    },
    [selectedDateMoment, today, userExerciseLogs]
  );

  return (
    <View style={styles.container}>
      <Row
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.monthHeader}>{currentMonth}</Text>
        <TouchableOpacity onPress={scrollToToday}>
          <Text style={styles.todayButton}>Today</Text>
        </TouchableOpacity>
      </Row>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <FlatList
          data={datesList}
          keyExtractor={(item) => item.format("YYYY-MM-DD")}
          horizontal
          ref={flatListRef}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: width * 0.01,
            justifyContent: "center",
            alignItems: "center",
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          onViewableItemsChanged={onViewableItemsChanged}
          getItemLayout={(_, index) => ({
            length: ITEM_W,
            offset: ITEM_W * index,
            index,
          })}
          initialScrollIndex={initialScrollIndex} // render at the right index up-front
          windowSize={7}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: colors.lightCardBg,
    paddingTop: height * 0.1,
    height: height * 0.3,
    paddingHorizontal: width * 0.04,
  },
  monthHeader: {
    color: "rgba(0, 0, 0, 1)",
    fontFamily: "Inter_500Medium",
    fontSize: RFValue(14),
  },
  todayButton: {
    fontFamily: "Inter_400Regular",
    color: colors.primary,
    fontSize: RFValue(13),
  },
  dateItem: {
    width: ITEM_W,
    flexDirection: "column",
    gap: height * 0.005,
    borderRadius: width * 0.07,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.01,
    backgroundColor: "transparent",
  },
  selectedItem: { backgroundColor: "#2979FF" },
  dayName: {
    fontSize: RFValue(12),
    color: "black",
    fontFamily: "Inter_400Regular",
  },
  dayNumber: {
    fontSize: RFValue(20),
    color: "black",
    fontFamily: "Inter_400Regular",
  },
  todayText: { color: "#2563eb" },
  selectedText: { color: "white", opacity: 1 },
});

export default CalendarStripCustom;
