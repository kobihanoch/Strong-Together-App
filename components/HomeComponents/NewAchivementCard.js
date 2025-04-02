import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import useExerciseTracking from "../../hooks/useExerciseTracking";

const { width, height } = Dimensions.get("window");

function NewAchivementCard({ hasAssignedWorkout, PR }) {
  return (
    <View
      style={{
        flex: 3,
        height: "100%",
        borderRadius: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
        alignItems: "center",
        justifyContent: "center",
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
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flex: 6,
                justifyContent: "center",
                alignItems: "center",
                marginTop: height * 0.01,
                gap: height * 0.01,
              }}
            >
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontFamily: "Inter_700Bold",
                  fontSize: RFValue(13),
                }}
              >
                Personal Record
              </Text>
              <View
                style={{
                  shadowColor: "#FFD700",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.7,
                  shadowRadius: 20,
                  elevation: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50%",
                  width: "50%",
                }}
              >
                <Image
                  source={require("../../assets/gold-medal.png")}
                  style={{ height: "100%", width: "100%" }}
                ></Image>
              </View>
            </View>
            <View
              style={{
                flex: 4,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: RFValue(12),
                  marginTop: height * 0.0,
                  fontFamily: "Inter_700Bold",
                  opacity: 0.8,
                }}
              >
                {PR.maxExercise}
              </Text>
              <Text
                style={{
                  color: "black",
                  fontFamily: "Inter_400Regular",
                  fontSize: RFValue(13),
                  marginTop: height * 0.01,
                  opacity: 0.8,
                }}
              >
                {PR.maxWeight} kg
              </Text>
              <Text
                style={{
                  color: "black",
                  fontFamily: "Inter_400Regular",
                  fontSize: RFValue(13),
                  opacity: 0.8,
                }}
              >
                {" "}
                for {PR.maxReps} reps
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "column",
              gap: height * 0.02,
              opacity: 0.6,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/gold-medal.png")}
              style={{ height: height * 0.12, width: height * 0.12 }}
            ></Image>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                color: "white",
                fontSize: RFValue(11),
                textAlign: "center",
              }}
            >
              No personal record yet
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default NewAchivementCard;
