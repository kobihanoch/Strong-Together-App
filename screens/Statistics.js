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
  const { splitsCount, loading } = useStatisticsPageLogic(user);

  return loading ? (
    <LoadingPage message="Analyzing" />
  ) : (
    <View style={styles.pageContainer}>
      <View
        style={[styles.contentContainer, { flex: 1, alignItems: "flex-start" }]}
      >
        <Text style={{ fontFamily: "PoppinsBold", fontSize: RFValue(18) }}>
          Your progreesion
        </Text>
      </View>
      <LinearGradient
        colors={["#00142a", "#0d2540"]}
        style={[
          styles.contentContainer,
          {
            flex: 2.5,
            backgroundColor: "rgb(69, 0, 148)",
            borderRadius: height * 0.02,
          },
        ]}
      >
        <CalendarCard />
      </LinearGradient>
      <View
        style={[
          styles.contentContainer,
          { flex: 3.5, backgroundColor: "blue" },
        ]}
      >
        <Text>PRS of workout</Text>
      </View>
      <View
        style={[
          styles.contentContainer,
          { flex: 3, backgroundColor: "orange" },
        ]}
      >
        <Text>Lessons learned for next workout</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingVertical: height * 0.02,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StatisticsPage;
