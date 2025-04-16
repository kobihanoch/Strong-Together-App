import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

function CreateOrEditWorkoutCard({ hasAssignedWorkout }) {
  const navigation = useNavigation();

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
          <>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: height * 0.02,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(12),
                  color: "black",
                  marginBottom: height * 0.015,
                }}
              >
                Edit workout
              </Text>

              <View
                style={{
                  aspectRatio: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: height * 0.02,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("CreateWorkout")}
                  style={{
                    borderRadius: height * 0.03,
                    backgroundColor: "#2979FF",
                    padding: height * 0.017,
                  }}
                >
                  <View>
                    <MaterialCommunityIcons
                      name="pencil-outline"
                      color="white"
                      size={RFValue(15)}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: height * 0.02,
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(12),
                  color: "black",
                  marginBottom: height * 0.015,
                }}
              >
                New Workout
              </Text>

              <View
                style={{
                  aspectRatio: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: height * 0.02,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("CreateWorkout")}
                  style={{
                    backgroundColor: "#2979FF",
                    borderRadius: height * 0.03,
                    padding: height * 0.01,
                  }}
                >
                  <View>
                    <MaterialCommunityIcons
                      name="plus"
                      color="white"
                      size={RFValue(20)}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

export default CreateOrEditWorkoutCard;
