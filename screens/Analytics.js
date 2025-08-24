import React, { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Card from "../components/AnalyticsComponents.js/Card";
import useAnalysticsLogic from "../hooks/logic/useAnalysticsLogic";
import { RFValue } from "react-native-responsive-fontsize";
import Overview from "../components/AnalyticsComponents.js/Overview";
import Estimated1RM from "../components/AnalyticsComponents.js/Estimated1RM";
import VolumeAttendence from "../components/AnalyticsComponents.js/VolumeAttendence";

const { width, height } = Dimensions.get("window");

const Analytics = () => {
  const { data, loading, globalLoading } = useAnalysticsLogic();
  // Need to plug estimated PRs
  const { overview, _1rms, adherence } = data;

  return (
    !loading &&
    !globalLoading && (
      <ScrollView
        style={{
          width: "100%",
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Overview overViewData={overview}></Overview>
        <Estimated1RM rmData={_1rms}></Estimated1RM>
        <VolumeAttendence adherenceData={adherence}></VolumeAttendence>
      </ScrollView>
    )
  );
};

export default Analytics;
