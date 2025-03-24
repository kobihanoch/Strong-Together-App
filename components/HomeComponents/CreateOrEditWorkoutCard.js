import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

function CreateOrEditWorkoutCard({ hasAssignedWorkout, navigation }) {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
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
  );
}

export default CreateOrEditWorkoutCard;
