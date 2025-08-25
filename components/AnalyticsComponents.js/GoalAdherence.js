// English comments only inside the code

import React, { useCallback, useMemo, useState } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import PageDots from "../PageDots";
import Card from "./Card";
import RenderGoalAdherenceItem from "./RenderGoalAdherenceItem";

const { height } = Dimensions.get("window");

export default function GoalAdherence({ adherenceData, onSeeAll, hasData }) {
  const adh = adherenceData?.adh || {};
  const data = useMemo(() => Object.entries(adh), [adh]);
  const [pageWidth, setPageWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const onLayout = useCallback((e) => {
    setPageWidth(e.nativeEvent.layout.width);
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e) => {
      if (!pageWidth) return;
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / pageWidth);
      setIndex(i);
    },
    [pageWidth]
  );

  return (
    <Card
      style={{ width: "90%", alignSelf: "center", marginTop: height * 0.02 }}
      height={120}
      title={"Goal Adherence"}
      subtitle={"Actual / Planned reps per exercise"}
      titleColor="#000000ff"
      subtitleColor="#797979ff"
      iconColor="black"
      iconName={"target"}
      useBorder={true}
      borderWidth={0}
    >
      <View style={{ flexDirection: "column", marginTop: 10 }}>
        {hasData && data.length > 0 ? (
          <>
            <PageDots index={index} length={data.length} />
            <FlatList
              data={data}
              onLayout={onLayout}
              renderItem={({ item: [name, v] }) => (
                <RenderGoalAdherenceItem
                  name={name}
                  v={v}
                  pageWidth={pageWidth}
                  onSeeAll={onSeeAll}
                  showSeeAll={true}
                  limit={4} //limit only in the Card
                />
              )}
              keyExtractor={([name]) => String(name)}
              horizontal
              pagingEnabled
              style={{ flex: 1, marginTop: 25 }}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onMomentumScrollEnd}
              nestedScrollEnabled
            />
          </>
        ) : (
          <View>
            <Text>No data</Text>
          </View>
        )}
      </View>
    </Card>
  );
}
