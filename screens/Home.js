import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import LastWorkoutSection from "../components/HomeComponents/LastWorkoutSection";
import QuickLookSection from "../components/HomeComponents/QuickLookSection";
import StartWorkoutButton from "../components/HomeComponents/StartWorkoutButton";
import useHomePageLogic from "../hooks/logic/useHomePageLogic";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  // Hook handling
  const { data: userData, isLoading } = useHomePageLogic();

  if (isLoading) {
    return null;
  }
  return (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      <View style={styles.midContainer}>
        {/*flex 2*/}
        <View
          style={{
            flex: 3,
            flexDirection: "column",
            gap: height * 0.03,
            justifyContent: "center",
            width: "100%",
            padding: height * 0.03,
            borderRadius: height * 0.04,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 1,
          }}
        >
          <Text style={styles.headerText}>Hello, {userData?.firstName}!</Text>
          <StartWorkoutButton></StartWorkoutButton>
        </View>

        {/*flex 1*/}
        <LastWorkoutSection data={userData}></LastWorkoutSection>

        {/*flex 6*/}
        <QuickLookSection data={userData}></QuickLookSection>
      </View>
    </View>
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
    flex: 1,
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
