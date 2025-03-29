import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import { RFValue } from "react-native-responsive-fontsize";

const CalendarCard = () => {
  const [selectedDate, setSelectedDate] = useState(moment());

  return (
    <View style={{ height: "70%", width: "95%" }}>
      <CalendarStrip
        scrollable
        style={{ flex: 1 }}
        selectedDate={selectedDate}
        onDateSelected={(date) => setSelectedDate(date.format("YYYY-MM-DD"))}
        calendarColor={"transparent"}
        highlightDateNameStyle={{
          color: "white",
          fontSize: RFValue(10),
          fontFamily: "PoppinsBold",
        }}
        highlightDateNumberStyle={{
          color: "black",
          fontSize: RFValue(15),
          fontFamily: "PoppinsBold",
          backgroundColor: "white",
          padding: 3,
          borderRadius: 25,
        }}
        dateNumberStyle={{
          color: "white",
          fontSize: RFValue(15),
          fontFamily: "PoppinsBold",
        }}
        dateNameStyle={{
          color: "white",
          fontSize: RFValue(10),
          fontFamily: "PoppinsRegular",
        }}
        dateContainerStyle={{
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
        iconContainer={{ flex: 0.1 }}
        startingDate={moment()}
        calendarHeaderStyle={{
          color: "white",
          opacity: 0.6,
          fontSize: RFValue(12),
          fontFamily: "PoppinsRegular",
        }}
        leftSelector={
          <FontAwesome5 name="chevron-left" size={RFValue(8)} color="white" />
        }
        rightSelector={
          <FontAwesome5 name="chevron-right" size={RFValue(8)} color="white" />
        }
      />
    </View>
  );
};

export default CalendarCard;
