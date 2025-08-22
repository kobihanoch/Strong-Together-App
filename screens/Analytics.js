import React, { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Card from "../components/AnalyticsComponents.js/Card";
import useAnalysticsLogic from "../hooks/logic/useAnalysticsLogic";
import { RFValue } from "react-native-responsive-fontsize";
import Overview from "../components/AnalyticsComponents.js/Overview";
import Estimated1RM from "../components/AnalyticsComponents.js/Estimated1RM";

const { width, height } = Dimensions.get("window");

const Analytics = () => {
  const { data, loading } = useAnalysticsLogic();
  // Need to plug estimated PRs
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
      <Estimated1RM></Estimated1RM>
    </ScrollView>
  );
};

export default Analytics;
