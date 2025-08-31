import React from "react";
import { Dimensions, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");
const HeaderSection = ({ user }) => {
  const { t } = useTranslation();
  const firstName = (user?.name || "").split(" ")[0] || "";

  return (
    <View style={{ flex: 1.5, width: "90%", justifyContent: "flex-end" }}>
      <Text
        style={{
          fontFamily: "Inter_600SemiBold",
          fontSize: RFValue(25),
          alignSelf: "flex-start",
        }}
      >
        {t("home.greeting", { name: firstName })}
        {"\n"}
        <Text
          style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(25) }}
        >
          {t("home.ready")}
        </Text>
      </Text>
    </View>
  );
};

export default HeaderSection;
