import React, { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Card from "../components/AnalyticsComponents.js/Card";
import useAnalysticsLogic from "../hooks/logic/useAnalysticsLogic";
import { RFValue } from "react-native-responsive-fontsize";
import Overview from "../components/AnalyticsComponents.js/Overview";

const { width, height } = Dimensions.get("window");

const Analytics = () => {
  const { data, loading } = useAnalysticsLogic();
  const { overview } = data;

  if (loading) return null;

  return (
    <ScrollView
      style={{
        width: "100%",
        flex: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Overview overViewData={overview}></Overview>

      <Card
        style={{ width: "90%", alignSelf: "center", marginTop: height * 0.02 }}
        height={120}
        title={"Weekly volume"}
        subtitle={"Volume per muscle"}
        titleColor="#000000ff"
        subtitleColor="#797979ff"
        useBorder={true}
        borderColor="grey"
        borderWidth={0.2}
        iconColor="#22D3EE"
      >
        <View
          style={{
            backgroundColor: "red",
            height: height * 0.3,
            flexDirection: "row",
          }}
        >
          <View
            style={{ flex: 5, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Count</Text>
          </View>
          <View
            style={{ flex: 5, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Count</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

export default Analytics;
