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
import { useTranslation } from "react-i18next";
import { tExercise } from "../../utils/translationUtils";

const { width, height } = Dimensions.get("window");

function NewAchivementCard({ hasAssignedWorkout, PR }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();

  // Translate PR exercise if it exists
  const prExerciseName = PR?.maxExercise
    ? tExercise(t, PR.maxExercise)
    : t("common.na");

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
            {t("pr.title")}
          </Text>
          <Image
            source={require("../../assets/gold-medal.png")}
            style={{ height: height * 0.08, aspectRatio: 1 }}
          />
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(14) }}
          >
            {hasAssignedWorkout ? prExerciseName : t("common.noData")}
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
                ? PR?.maxWeight
                  ? t("units.kg", { value: PR?.maxWeight })
                  : t("common.na")
                : t("common.na")}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                color: "rgb(137, 137, 137)",
              }}
            >
              {t("labels.weight")}
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: RFValue(14),
              }}
            >
              {hasAssignedWorkout
                ? PR?.maxReps ?? t("common.na")
                : t("common.na")}
            </Text>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: RFValue(13),
                color: "rgb(137, 137, 137)",
              }}
            >
              {t("labels.reps")}
            </Text>
          </View>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
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
              {t("pr.detailsTitle")}
            </Text>

            <Text
              style={{ fontFamily: "Inter_500Medium", fontSize: RFValue(14) }}
            >
              {t("labels.exercise")}: {prExerciseName}
            </Text>
            <Text
              style={{ fontFamily: "Inter_500Medium", fontSize: RFValue(14) }}
            >
              {t("labels.weight")}: {t("units.kg", { value: PR?.maxWeight })}
            </Text>
            <Text
              style={{ fontFamily: "Inter_500Medium", fontSize: RFValue(14) }}
            >
              {t("labels.reps")}: {PR?.maxReps ?? t("common.na")}
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
                {t("common.close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default NewAchivementCard;
