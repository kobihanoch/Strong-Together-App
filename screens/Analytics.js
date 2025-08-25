import React from "react";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Estimated1RM from "../components/AnalyticsComponents.js/Estimated1RM";
import GoalAdherence from "../components/AnalyticsComponents.js/GoalAdherence";
import Overview from "../components/AnalyticsComponents.js/Overview";
import useAnalysticsLogic from "../hooks/logic/useAnalysticsLogic";

const { width, height } = Dimensions.get("window");

const Analytics = () => {
  const { data, loading, globalLoading, hasData } = useAnalysticsLogic();
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
        <Overview overViewData={overview} hasData={hasData}></Overview>
        <GoalAdherence
          adherenceData={adherence}
          hasData={hasData}
        ></GoalAdherence>
        <Estimated1RM rmData={_1rms} hasData={hasData}></Estimated1RM>
      </ScrollView>
    )
  );
};

export default Analytics;
