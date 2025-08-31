import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useLang } from "../../src/i18n/LangProvider";

const { width, height } = Dimensions.get("window");

const StartWorkoutButton = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isRTL } = useLang();

  return (
    <View style={{ flex: 1, width: "85%", alignSelf: "center" }}>
      <TouchableOpacity
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2979FF",
          borderRadius: height * 0.02,
          width: "100%",
          height: "80%",
          gap: width * 0.03,
        }}
        onPress={() => {
          navigation.navigate("MyWorkoutPlan");
        }}
      >
        <FontAwesome5
          name="dumbbell"
          size={RFValue(18)}
          color="white"
        ></FontAwesome5>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            color: "white",
            fontSize: RFValue(18),
          }}
        >
          {t("home.startWorkout")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartWorkoutButton;
