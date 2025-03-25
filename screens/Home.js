import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Layout from "../components/Layout";
import useWorkoutSplits from "../hooks/useWorkoutSplits";
import { useAuth } from "../context/AuthContext";
import TopComponent from "../components/TopComponent";
import React, { useState, useEffect } from "react";
import supabase from "../src/supabaseClient";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import MostCommonWorkoutSummaryCard from "../components/HomeComponents/MostCommonWorkoutSummaryCard";
import WorkoutCountCard from "../components/HomeComponents/WorkoutCountCard";
import { useUserWorkout } from "../hooks/useUserWorkout";
import LoadingPage from "../components/LoadingPage";
import CreateOrEditWorkoutCard from "../components/HomeComponents/CreateOrEditWorkoutCard";
import NewAchivementCard from "../components/HomeComponents/NewAchivementCard";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const { refetch, userWorkout, loading, error } = useUserWorkout(user?.id);
  const [hasAssignedWorkout, setHasAssignedWorkout] = useState(false);
  const profileImageUrl = user?.profile_image_url;

  // Set username after user is laoded
  useEffect(() => {
    console.log("User is:  " + JSON.stringify(user))
    if (user && user.username && user.id) {
    setUsername(user.username);
    setUserId(user.id);
  }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.id) {
        refetch();
      }
    }, [user?.id])
  );

  // Set user's assigned workout state after user is loaded
  useEffect(() => {
    if (userWorkout && userWorkout.length > 0) {
      setHasAssignedWorkout(true);
    } else {
      setHasAssignedWorkout(false);
    }
  }, [userWorkout]);

  return loading ? (
    <LoadingPage message="Loading user data..." />
  ) : (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1.5,
          }}
        >
          <Image
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require("../assets/profile.png")
            }
            style={{
              height: height * 0.06,
              width: height * 0.06,
              resizeMode: "stretch",
              borderRadius: height * 0.05,
            }}
          ></Image>
        </View>
        <View style={{ justifyContent: "center", flex: 8.5 }}>
          <Text style={styles.headerText}>
            Welcome,{" "}
            <Text style={{ fontFamily: "PoppinsBold" }}>{username} </Text>!
          </Text>
          <Text
            style={{
              fontSize: RFValue(13),
              color: "black",
              fontFamily: "PoppinsRegular",
            }}
          >
            Check out your dashboard
          </Text>
        </View>
      </View>

      <View style={styles.midContainer}>
        <View style={{ flex: 1.5 }}>
          <WorkoutCountCard userId={userId} height={height} width={width} />
        </View>
        <View
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
            gap: width * 0.02,
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
        </View>
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
    fontFamily: "PoppinsRegular",
    color: "black",
    fontSize: RFValue(18),
  },
  semiHeaderText: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(13),
    marginTop: height * 0.01,
  },

  midContainer: {
    flex: 8.5,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: height * 0.01,
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
    fontFamily: "PoppinsBold",
    fontSize: width * 0.04,
    textAlign: "center",
  },
});

export default Home;
