import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
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
import Theme1 from "../components/Theme1";
import useExerciseTracking from "../hooks/useExerciseTracking";
import GoToButton from "../components/HomeComponents/GoToButton";
import MostCommonWorkoutSummaryCard from "../components/HomeComponents/MostCommonWorkoutSummaryCard";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [
    mostFrequentWorkoutSplitMuscleGroup,
    setMostFrequentWorkoutSplitMuscleGroup,
  ] = useState(null);

  const { fetchWorkoutSplit } = useWorkoutSplits();

  const {
    trackingData: exerciseTrackingData,
    loading,
    error,
  } = useExerciseTracking(userId ?? null);

  const uniqueDates = new Set();

  exerciseTrackingData.forEach((item) => {
    const date = new Date(item.workoutdate).toDateString();
    uniqueDates.add(date);
  });

  const totalWorkoutsNumber = uniqueDates.size;

  // Set username after user is laoded
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setUserId(user.id);
    }
  }, [user]);

  if (!user || !user.username) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No user data available.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Welcome back,{" "}
          <Text style={{ fontFamily: "PoppinsBold" }}>{username} </Text>!
        </Text>
        <Text style={styles.semiHeaderText}>Check out your dashboard</Text>
      </View>

      <View style={styles.midContainer}>
        <View style={{ flex: 2 }}>
          <View style={styles.workoutsContainer}>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#7d9bbd",
                fontSize: RFValue(13),
              }}
            >
              Your workout count is
            </Text>
            <View style={{}}>
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  color: "#FACC15",
                  fontSize: RFValue(18),
                  alignSelf: "center",
                }}
              >
                {totalWorkoutsNumber}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 3.5,
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
          <View
            style={{
              flex: 4,
              backgroundColor: "#0d2540",
              borderRadius: height * 0.02,
              flexDirection: "column",
              justifyContent: "space-between",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontFamily: "PoppinsBold",
                color: "white",
                padding: height * 0.02,
              }}
            >
              Schedule workout
            </Text>
          </View>
        </View>
        <View style={{ flex: 4.5, flexDirection: "row" }}>
          <View
            style={{
              width: "90%",
              display: "flex",
              backgroundColor: "#0d2540",
              borderRadius: height * 0.02,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text>View</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0.15,
    paddingHorizontal: width * 0.06,
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(16),
  },
  semiHeaderText: {
    fontFamily: "PoppinsRegular",
    fontSize: RFValue(13),
    marginTop: height * 0.01,
  },

  midContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: height * 0.01,
  },
  workoutsContainer: {
    backgroundColor: "#0d2540",
    height: "100%",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: height * 0.02,
    paddingHorizontal: width * 0.08,
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
