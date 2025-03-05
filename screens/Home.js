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
import { useAuth } from "../context/AuthContext"; // גישה לקונטקסט
import TopComponent from "../components/TopComponent";
import React, { useState, useEffect } from "react";
import supabase from "../src/supabaseClient"; // מניח שיש לך קליינט של Supabase מוגדר
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import Theme1 from "../components/Theme1";
import useExerciseTracking from "../hooks/useExerciseTracking";
import GoToButton from "../components/HomeComponents/GoToButton";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(null);

  const {
    trackingData: exerciseTrackingData,
    loading,
    error,
  } = useExerciseTracking(user?.id);
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
    }
  }, [user]);

  if (!user || !user.username) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No user data available.</Text>
      </View>
    );
  }

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack", params: { screen: "Intro" } }],
    });
  };

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
        <View
          style={{ flex: 0.6, justifyContent: "center", alignItems: "center" }}
        >
          <View style={styles.workoutsContainer}>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#8ca7d1",
                fontSize: RFValue(12),
                opacity: 0.5,
              }}
            >
              Workouts made
            </Text>
            <Text
              style={{
                fontFamily: "PoppinsBold",
                color: "#FACC15",
                fontSize: RFValue(20),
                alignSelf: "center",
                textShadowColor: "#FACC15",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 5,
              }}
            >
              {totalWorkoutsNumber}
            </Text>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                color: "#8ca7d1",
                fontSize: RFValue(12),
                alignSelf: "center",
              }}
            >
              Keep it up !
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 0.4,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>asd</Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View
          style={{
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <GoToButton>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: RFValue(14),
                color: "black",
              }}
            >
              Button 1
            </Text>
          </GoToButton>
        </View>
        <View
          style={{
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <GoToButton>
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: RFValue(14),
                color: "black",
              }}
            >
              Create/Change workout
            </Text>
          </GoToButton>
        </View>
        <View
          style={{
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <GoToButton onPress={handleLogout}>
            <Text
              style={{
                fontFamily: "PoppinsBold",
                fontSize: RFValue(14),
                color: "red",
              }}
            >
              Log Out
            </Text>
          </GoToButton>
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
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  workoutsContainer: {
    backgroundColor: "#00142a",
    height: "80%",
    width: "90%",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: height * 0.04,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },

  bottomContainer: {
    flex: 0.42,
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
