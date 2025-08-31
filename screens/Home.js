// English comments only inside the code
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import QuickLookSection from "../components/HomeComponents/QuickLookSection";
import StartWorkoutButton from "../components/HomeComponents/StartWorkoutButton";
import useHomePageLogic from "../hooks/logic/useHomePageLogic";
import { Skeleton } from "moti/skeleton";
import { useTranslation } from "react-i18next";
import { useLang } from "../src/i18n/LangProvider";

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { data: userData, isLoading } = useHomePageLogic();
  const { t } = useTranslation();
  const { isRTL } = useLang();

  return (
    <Skeleton.Group show={isLoading}>
      <View
        style={{
          flex: 1,
          paddingVertical: height * 0.02,
          writingDirection: isRTL ? "rtl" : "ltr",
        }}
      >
        <View style={styles.midContainer}>
          <View
            style={{
              flex: 3,
              flexDirection: "column",
              gap: height * 0.03,
              justifyContent: "center",
              width: "100%",
              padding: height * 0.03,
              borderRadius: height * 0.04,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.05,
              shadowRadius: 5,
              elevation: 1,
            }}
          >
            <Skeleton
              width={width * 0.5}
              height={height * 0.06}
              radius={10}
              colorMode="light"
            >
              <Text style={[styles.headerText]}>
                {isLoading
                  ? ""
                  : t("home.greeting", { name: userData?.firstName || "" })}
              </Text>
            </Skeleton>

            <Skeleton colorMode="light" height={height * 0.1} width={"100%"}>
              <StartWorkoutButton />
            </Skeleton>
          </View>

          <QuickLookSection data={userData} isLoading={isLoading} />
        </View>
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "Inter_600SemiBold",
    color: "black",
    fontSize: RFValue(35),
    alignItems: "flex-start",
    alignSelf: "flex-start",
  },
  midContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: height * 0.005,
  },
});

export default Home;
