import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import WorkoutGenericBuildSettingsCard from "../components/CreateWorkoutComponents/WorkoutGenericBuildSettingsCard";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GradientedGoToButton from "../components/GradientedGoToButton";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  // Set username after user is laoded
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setUserId(user.id);
    }
  }, [user]);

  return (
    <LinearGradient
      colors={["#0d2540", "#3d85d9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        paddingVertical: height * 0.02,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          paddingHorizontal: width * 0.05,
        }}
      >
        <View
          style={{
            flex: 2,
            flexDirection: "column",
            gap: height * 0.01,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "PoppinsBold",
              fontSize: RFValue(17),
              color: "white",
            }}
          >
            Create workout
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsRegular",
              fontSize: RFValue(12),
              opacity: 0.5,
              color: "white",
            }}
          >
            At first, we would like to know how many splits you want to have.
          </Text>
        </View>
        <View style={{ flex: 6 }}>
          <WorkoutGenericBuildSettingsCard />
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <View style={{ width: "50%" }}>
            <GradientedGoToButton
              gradientColors={["#FF6347", "#FF4500"]}
              borderRadius={height * 0.08}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: 0.8,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: RFValue(10),
                    fontFamily: "PoppinsBold",
                  }}
                >
                  Continue
                </Text>
                <FontAwesome5
                  name={"stopwatch"}
                  size={RFValue(13)}
                  color={"white"}
                  style={{ marginLeft: width * 0.02 }}
                ></FontAwesome5>
              </View>
            </GradientedGoToButton>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default CreateWorkout;
