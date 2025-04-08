import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

/*<Image
              source={require("../../assets/gold-medal.png")}
              style={{ height: height * 0.12, width: height * 0.12 }}
            ></Image>*/

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
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            flex: 6.3,
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(12) }}
          >
            Personal Record
          </Text>
          <Image
            source={require("../../assets/gold-medal.png")}
            style={{ height: height * 0.08, aspectRatio: 1 }}
          ></Image>
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(14) }}
          >
            {hasAssignedWorkout ? PR.maxExercise : "No data yet"}
          </Text>
        </View>
        <View
          style={{ flex: 0.2, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{
              height: "90%",
              width: 1,
              backgroundColor: "rgba(156, 156, 156, 0.4)",
            }}
          ></View>
        </View>
        <View
          style={{
            flex: 3.9,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: height * 0.02,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                color: "rgb(137, 137, 137)",
              }}
            >
              {hasAssignedWorkout ? PR.maxWeight + " kg" : "N/A"}
            </Text>
            <Text
              style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(14) }}
            >
              Weight
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                color: "rgb(137, 137, 137)",
              }}
            >
              {hasAssignedWorkout ? PR.maxReps : "N/A"}
            </Text>
            <Text
              style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(14) }}
            >
              Reps
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default NewAchivementCard;
