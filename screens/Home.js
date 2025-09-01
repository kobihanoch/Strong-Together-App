import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import QuickLookSection from "../components/HomeComponents/QuickLookSection";
import StartWorkoutButton from "../components/HomeComponents/StartWorkoutButton";
import useHomePageLogic from "../hooks/logic/useHomePageLogic";
import { Skeleton } from "moti/skeleton";
import TopComponent from "../components/TopComponent";
import { ScrollView } from "react-native-gesture-handler";
import StartWorkoutCard from "../components/HomeComponents/StartWorkoutCard";
import NewAchivementCard from "../components/HomeComponents/NewAchivementCard";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  // Hook handling
  const { data: userData, isLoading } = useHomePageLogic();

  return (
    <Skeleton.Group show={isLoading}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={{ flex: 2 }}>
          <TopComponent />
        </View>
        <View style={{ flex: 8 }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.midContainer}>
              <StartWorkoutCard data={userData}></StartWorkoutCard>
              <NewAchivementCard
                PR={userData.PR}
                hasAssignedWorkout={userData.hasAssignedWorkout}
              ></NewAchivementCard>
            </View>
          </ScrollView>
        </View>
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: width * 0.06,
    flex: 1.5,
    flexDirection: "row",
    gap: width * 0.05,
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Inter_600SemiBold",
    color: "black",
    fontSize: RFValue(35),
    alignItems: "flex-start",
  },
  semiHeaderText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(13),
    marginTop: height * 0.01,
  },

  midContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: height * 0.005,
  },

  bottomContainer: {
    flex: 0,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },

  logoutButton: {
    marginTop: height * 0.1,
    backgroundColor: "#ff4d4d",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 25,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontSize: width * 0.04,
    textAlign: "center",
  },
});

export default Home;
