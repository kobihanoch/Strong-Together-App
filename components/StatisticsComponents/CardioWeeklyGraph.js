import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { normalizeDataToWeeklyCardioGraph } from "../../utils/statisticsUtils";

const { width, height } = Dimensions.get("window");

const CardioWeeklyGraph = ({ data, cardWidth }) => {
  const formattedData = useMemo(
    () => normalizeDataToWeeklyCardioGraph(data),
    [data]
  );

  if (!cardWidth) return null;

  const H_PAD = width * 0.05;
  const innerW = Math.max(0, cardWidth - H_PAD * 2);
  const BAR_WIDTH = width * 0.08;
  let spacingW = (innerW - 7 * BAR_WIDTH) / 6;
  if (!Number.isFinite(spacingW) || spacingW < 0) spacingW = 0;

  // Tooltip for the pressed bar (library handles which bar is focused)
  const renderTooltip = (item /*, index */) => {
    if (!item) return null;
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        <Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
          {item.label}
        </Text>
        <Text style={{ color: "white", fontSize: 12 }}>{item.value} mins</Text>
      </View>
    );
  };

  return (
    <View style={{ width: innerW, overflow: "hidden" }}>
      <BarChart
        width={innerW}
        data={formattedData}
        renderTooltip={renderTooltip} // <- show data on press
        xAxisThickness={0}
        xAxisColor="transparent"
        hideRules
        yAxisThickness={0}
        yAxisLabelWidth={0}
        hideYAxisText
        endSpacing={0}
        initialSpacing={0}
        yAxisIndicesWidth={0}
        isAnimated
        spacing={spacingW}
        barWidth={BAR_WIDTH}
        barBorderRadius={height * 0.01}
        noOfSections={1}
      />
    </View>
  );
};

export default CardioWeeklyGraph;
