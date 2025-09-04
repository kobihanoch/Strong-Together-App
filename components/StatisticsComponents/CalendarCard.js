import React from "react";
import { Dimensions, View } from "react-native";
import CalendarStripCustom from "./CalenderStripCustom";
import { colors } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

const CalendarCard = ({ selectedDate, setSelectedDate, userExerciseLogs }) => {
  return (
    <CalendarStripCustom
      onDateSelect={(date) => setSelectedDate(date)}
      selectedDate={selectedDate}
      userExerciseLogs={userExerciseLogs}
    />
  );
};

export default CalendarCard;
