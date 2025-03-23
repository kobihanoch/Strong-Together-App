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

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const { refetch, userWorkout, loading, error } = useUserWorkout(user?.id);
  const [hasAssignedWorkout, setHasAssignedWorkout] = useState(false);

  // Set username after user is laoded
  useEffect(() => {
    if (user) {
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

  if (!user || !user.username) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: No user data available.</Text>
      </View>
    );
  }

  return loading ? (
    <LoadingPage message="Loading user data..." />
  ) : (
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
          <WorkoutCountCard userId={userId} height={height} width={width} />
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
              justifyContent: "flex-start",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              gap: height * 0.02,
              paddingTop: height * 0.01,
            }}
          >
            {hasAssignedWorkout ? (
              <>
                <Text
                  style={{
                    fontFamily: "PoppinsBold",
                    color: "white",
                    padding: height * 0.02,
                  }}
                >
                  Edit workout
                </Text>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("CreateWorkout")}
                  >
                    <LinearGradient
                      colors={["#2196F3", "rgb(17, 87, 162)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: height * 0.08,
                        height: height * 0.08,
                        width: width * 0.2,
                      }}
                    >
                      <FontAwesome5
                        name="edit"
                        color="white"
                        size={RFValue(15)}
                      ></FontAwesome5>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontFamily: "PoppinsBold",
                    color: "white",
                    padding: height * 0.02,
                  }}
                >
                  Create workout
                </Text>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("CreateWorkout")}
                  >
                    <LinearGradient
                      colors={["#2196F3", "rgb(11, 129, 255)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: height * 0.08,
                        height: height * 0.08,
                        width: width * 0.2,
                      }}
                    >
                      <FontAwesome5
                        name="plus"
                        color="white"
                        size={RFValue(15)}
                      ></FontAwesome5>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
