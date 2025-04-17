import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

function NewAchivementCard({ hasAssignedWorkout, PR }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

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
          />
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(14) }}
          >
            {hasAssignedWorkout
              ? PR.maxExercise
                ? PR.maxExercise
                : "N/A"
              : "No data"}
          </Text>

          {/* Here will be the button fo the modal */}
          {/*hasAssignedWorkout && (
            <TouchableOpacity
              style={{
                marginTop: height * 0.01,
                paddingHorizontal: width * 0.04,
                paddingVertical: height * 0.008,
                backgroundColor: "#2979FF",
                borderRadius: height * 0.01,
              }}
              onPress={() => setIsModalVisible(true)}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: RFValue(12),
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                View Details
              </Text>
            </TouchableOpacity>
          )*/}
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
          />
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
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: RFValue(14),
              }}
            >
              {hasAssignedWorkout
                ? PR.maxWeight
                  ? PR.maxWeight + " kg"
                  : "N/A"
                : "N/A"}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                color: "rgb(137, 137, 137)",
              }}
            >
              Weight
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: RFValue(14),
              }}
            >
              {hasAssignedWorkout ? (PR.maxReps ? PR.maxReps : "N/A") : "N/A"}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                color: "rgb(137, 137, 137)",
              }}
            >
              Reps
            </Text>
          </View>
        </View>
      </View>

      {/* MODAL */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: width * 0.05,
          }}
        >
          <View
            style={{
              width: width * 0.85,
              backgroundColor: "white",
              borderRadius: height * 0.02,
              padding: width * 0.06,
              alignItems: "center",
              gap: height * 0.015,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: RFValue(16),
                marginBottom: height * 0.01,
              }}
            >
              Personal Record Details
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: RFValue(14),
              }}
            >
              🏋️ Exercise: {PR.maxExercise}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: RFValue(14),
              }}
            >
              🔩 Weight: {PR.maxWeight} kg
            </Text>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: RFValue(14),
              }}
            >
              🔁 Reps: {PR.maxReps}
            </Text>

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                marginTop: height * 0.01,
                backgroundColor: "#2979FF",
                paddingVertical: height * 0.012,
                paddingHorizontal: width * 0.25,
                borderRadius: width * 0.03,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(13),
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default NewAchivementCard;
