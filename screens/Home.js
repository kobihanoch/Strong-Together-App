import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CreateOrEditWorkoutCard from "../components/HomeComponents/CreateOrEditWorkoutCard";
import MostCommonWorkoutSummaryCard from "../components/HomeComponents/MostCommonWorkoutSummaryCard";
import NewAchivementCard from "../components/HomeComponents/NewAchivementCard";
import WorkoutCountCard from "../components/HomeComponents/WorkoutCountCard";
import LoadingPage from "../components/LoadingPage";
import { useAuth } from "../context/AuthContext";
import useHomePageLogic from "../hooks/logic/useHomePageLogic";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import StartWorkoutButton from "../components/HomeComponents/StartWorkoutButton";
import { formatDate } from "../utils/statisticsUtils";
import LastWorkoutSection from "../components/HomeComponents/LastWorkoutSection";
import QuickLookSection from "../components/HomeComponents/QuickLookSection";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { user } = useAuth();
  // Hook handling
  const {
    username,
    userId,
    hasAssignedWorkout,
    profileImageUrl,
    loading,
    firstName,
    lastWorkoutDate,
    error,
  } = useHomePageLogic(user);

  return loading ? (
    <LoadingPage message="Loading user data..." />
  ) : (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={{ justifyContent: "center", flex: 8.5 }}>
          <Text style={styles.headerText}>Hello, {firstName}!</Text>
        </View>
      </View>

      <View style={styles.midContainer}>
        {/*flex 1.1*/}
        <StartWorkoutButton></StartWorkoutButton>

        {/*flex 1*/}
        <LastWorkoutSection
          lastWorkoutDate={lastWorkoutDate}
        ></LastWorkoutSection>

        {/*flex 2.7*/}
        <QuickLookSection
          user={user}
          hasAssignedWorkout={hasAssignedWorkout}
        ></QuickLookSection>
        {/*<View
          style={{
            flex: 4,
            display: "flex",
            flexDirection: "row",
            gap: width * 0.02,
            width: "90%",
          }}
        >
          <MostCommonWorkoutSummaryCard
            userId={userId}
            height={height}
            width={width}
          />
        </View>
        <View
          style={{
            flex: 4.5,
            width: "88%",
            flexDirection: "row",
            gap: width * 0.01,
            justifyContent: "center",
          }}
        >
          <NewAchivementCard
            user={user}
            hasAssignedWorkout={hasAssignedWorkout}
          ></NewAchivementCard>
          <CreateOrEditWorkoutCard
            hasAssignedWorkout={hasAssignedWorkout}
            navigation={navigation}
          ></CreateOrEditWorkoutCard>
        </View>*/}
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
  },
  semiHeaderText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(13),
    marginTop: height * 0.01,
  },

  midContainer: {
    flex: 8.5,
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
