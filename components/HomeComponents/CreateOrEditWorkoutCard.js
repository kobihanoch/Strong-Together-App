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
    <LinearGradient
      colors={["rgb(59, 45, 89)", "rgb(34, 10, 83)"]}
      style={{
        width: "40%",
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
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        {hasAssignedWorkout ? (
          <>
            <View
              style={{
                flex: 3,
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: height * 0.02,
              }}
            >
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  color: "white",
                  fontSize: RFValue(13),
                }}
              >
                Edit workout
              </Text>
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  color: "white",
                  textAlign: "center",
                  fontSize: RFValue(10),
                  marginTop: height * 0.01,
                  opacity: 0.5,
                }}
              >
                Customize plan
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                flex: 7,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateWorkout")}
              >
                <LinearGradient
                  colors={["rgb(151, 131, 239)", "rgb(111, 40, 224)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: height * 0.04,
                    height: height * 0.1,
                    width: width * 0.23,
                    opacity: 0.7,
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
                marginTop: height * 0.05,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateWorkout")}
              >
                <LinearGradient
                  colors={["rgb(151, 131, 239)", "rgb(111, 40, 224)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: height * 0.04,
                    height: height * 0.1,
                    width: width * 0.23,
                    opacity: 0.7,
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
    </LinearGradient>
  );
}

export default CreateOrEditWorkoutCard;
