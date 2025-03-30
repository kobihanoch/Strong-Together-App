import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const CalendarStripCustom = ({ onDateSelect, selectedDate }) => {
  const [datesList, setDatesList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    moment().format("MMMM YYYY")
  );
  const flatListRef = useRef(null);

  useEffect(() => {
    generateDates();
  }, []);

  useEffect(() => {
    scrollToSelectedDate();
  }, [datesList]);

  const generateDates = () => {
    const days = [];
    const start = moment().clone().subtract(45, "days");
    const end = moment().clone().add(45, "days");

    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      days.push(current.clone());
      current.add(1, "day");
    }

    setDatesList(days);
  };

  const handleDatePress = (date) => {
    onDateSelect && onDateSelect(date.format("YYYY-MM-DD"));
  };

  const scrollToSelectedDate = () => {
    const index = datesList.findIndex((d) => d.isSame(selectedDate, "day"));

    const itemWidth = width * 0.14 + width * 0.02;
    const offset = index * itemWidth - width / 2 + itemWidth / 2;

    if (index !== -1 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToOffset({
          offset: offset > 0 ? offset : 0,
          animated: false,
        });
      }, 100);
    }
  };

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const centerItem = viewableItems[Math.floor(viewableItems.length / 2)];
      if (centerItem) {
        const date = centerItem.item;
        setCurrentMonth(date.format("MMMM YYYY"));
      }
    }
  });

  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const renderItem = ({ item }) => {
    const isSelected = item.isSame(selectedDate, "day");
    const isToday = item.isSame(moment(), "day");

    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.selectedItem]}
        onPress={() => handleDatePress(item)}
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.monthHeader}>{currentMonth}</Text>

      <View style={{ width: "100%", alignItems: "center" }}>
        <FlatList
          ref={flatListRef}
          data={datesList}
          keyExtractor={(item) => item.format("YYYY-MM-DD")}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: width * 0.01,
            justifyContent: "center",
            alignItems: "center",
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          getItemLayout={(data, index) => ({
            length: width * 0.14 + width * 0.02,
            offset: (width * 0.14 + width * 0.02) * index,
            index,
          })}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: height * 0.02,
  },
  monthHeader: {
    textAlign: "center",
    color: "white",
    fontFamily: "PoppinsBold",
    fontSize: RFValue(14),
  },
  dateItem: {
    width: width * 0.14,
    aspectRatio: 1,
    borderRadius: width * 0.07,
    marginHorizontal: width * 0.01,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectedItem: {
    backgroundColor: "white",
  },
  dayName: {
    fontSize: RFValue(10),
    color: "white",
    fontFamily: "PoppinsRegular",
  },
  dayNumber: {
    fontSize: RFValue(20),
    color: "white",
    fontFamily: "PoppinsBold",
  },
  selectedText: {
    color: "black",
  },
});

export default CalendarStripCustom;
