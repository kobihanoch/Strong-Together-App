import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import LoadingPage from "../components/LoadingPage";
import CalendarCard from "../components/StatisticsComponents/CalendarCard";
import { useAuth } from "../context/AuthContext";
import useStatisticsPageLogic from "../hooks/logic/useStatisticsPageLogic";

const { width, height } = Dimensions.get("window");

const StatisticsPage = () => {
  const { user } = useAuth();
  const { selectedDate, setSelectedDate, loading } =
    useStatisticsPageLogic(user);

  return loading ? (
    <LoadingPage message="Analyzing" />
  ) : (
    <LinearGradient
      colors={["#00142a", "#0d2540"]}
      style={[
        styles.pageContainer,
        {
          flex: 6,
          backgroundColor: "rgb(69, 0, 148)",
          borderRadius: height * 0.0,
          flexDirection: "column",
          paddingHorizontal: width * 0.05,
        },
      ]}
    >
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <Text
          style={{
            fontFamily: "PoppinsBold",
            fontSize: RFValue(18),
            color: "white",
          }}
        >
          Your progreesion
        </Text>
      </View>
      <View
        style={{
          flex: 3,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CalendarCard
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </View>
      <View style={{ flex: 7 }}>
        <Text>asdas</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingVertical: height * 0.03,
    flexDirection: "column",
  },
  contentContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StatisticsPage;
