import React from "react";
import { View } from "react-native";
import CalendarStripCustom from "./CalenderStripCustom";

const CalendarCard = ({ selectedDate, setSelectedDate }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CalendarStripCustom
        onDateSelect={(date) => setSelectedDate(date)}
        selectedDate={selectedDate}
      />
    </View>
  );
};

export default CalendarCard;
