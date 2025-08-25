import React, { useCallback, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Estimated1RM from "../components/AnalyticsComponents.js/Estimated1RM";
import GoalAdherence from "../components/AnalyticsComponents.js/GoalAdherence";
import Overview from "../components/AnalyticsComponents.js/Overview";
import useAnalysticsLogic from "../hooks/logic/useAnalysticsLogic";
import BottomModalFlatlist from "../components/BottomModalFlatlist";
import RenderEst1RMItem from "../components/AnalyticsComponents.js/RenderEst1RMItem";

const { width, height } = Dimensions.get("window");

const Analytics = () => {
  const { data, loading, globalLoading, hasData } = useAnalysticsLogic();
  // Need to plug estimated PRs
  const { overview, _1rms, adherence } = data;

  const modalRef = useRef(null);

  const openModal = useCallback(() => {
    modalRef.current?.open?.(1);
  }, []);

  return (
    !loading &&
    !globalLoading && (
      <View style={{ flex: 1 }}>
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
          <Estimated1RM
            rmData={_1rms}
            hasData={hasData}
            onSeeAll={openModal}
          ></Estimated1RM>
        </ScrollView>

        <BottomModalFlatlist
          title="All Estimated 1RMs"
          ref={modalRef}
          data={Object.entries(_1rms.rm)}
          renderItem={({ item }) => {
            const [k, v] = item;
            return <RenderEst1RMItem k={k} v={v} />;
          }}
          snapPoints={["25%", "50%", "70%"]}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default Analytics;
