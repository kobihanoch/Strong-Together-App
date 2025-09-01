import { Skeleton } from "moti/skeleton";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import PRCard from "../components/HomeComponents/PRCard";
import QuickActions from "../components/HomeComponents/QuickActions";
import StartWorkoutCard from "../components/HomeComponents/StartWorkoutCard";
import TopComponent from "../components/TopComponent";
import useHomePageLogic from "../hooks/logic/useHomePageLogic";

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
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.midContainer}>
              <StartWorkoutCard data={userData}></StartWorkoutCard>
              <PRCard
                PR={userData.PR}
                hasAssignedWorkout={userData.hasAssignedWorkout}
              ></PRCard>
              <QuickActions
                hasAssignedWorkout={userData.hasAssignedWorkout}
              ></QuickActions>
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
    gap: height * 0.03,
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
