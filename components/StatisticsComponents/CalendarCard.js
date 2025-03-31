import React from "react";
import { View } from "react-native";
import CalendarStripCustom from "./CalenderStripCustom";

const CalendarCard = ({ selectedDate, setSelectedDate, userExerciseLogs }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CalendarStripCustom
        onDateSelect={(date) => setSelectedDate(date)}
        selectedDate={selectedDate}
        userExerciseLogs={userExerciseLogs}
      />
    </View>
  );
};

export default CalendarCard;
