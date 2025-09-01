import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import QuickLookSection from "../components/HomeComponents/QuickLookSection";
import StartWorkoutButton from "../components/HomeComponents/StartWorkoutButton";
import useHomePageLogic from "../hooks/logic/useHomePageLogic";
import { Skeleton } from "moti/skeleton";
import TopComponent from "../components/TopComponent";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  // Hook handling
  const { data: userData, isLoading } = useHomePageLogic();

  return (
    <Skeleton.Group show={isLoading}>
      <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
        <View style={{ flex: 1.7 }}>
          <TopComponent />
        </View>
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
            <Skeleton
              width={width * 0.5}
              height={height * 0.06}
              radius={10}
              colorMode="light"
            >
              <Text style={styles.headerText}>
                {isLoading ? "" : `Hello, ${userData?.firstName}!`}
              </Text>
            </Skeleton>
            <Skeleton colorMode="light" height={height * 0.1} width={"100%"}>
              <StartWorkoutButton></StartWorkoutButton>
            </Skeleton>
          </View>

          {/*flex 7*/}
          <QuickLookSection
            data={userData}
            isLoading={isLoading}
          ></QuickLookSection>
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
    flex: 7.3,
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
