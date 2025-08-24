import { FontAwesome5 } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AdherenceBar } from "../AdherenceBar";
import PageDots from "../PageDots";
import Card from "./Card";

const { width, height } = Dimensions.get("window");

const adhumeAttendence = ({ adherenceData, onSeeAll }) => {
  const { adh } = adherenceData;
  const data = useMemo(() => Object.entries(adh), [adh]);
  const [pageWidth, setPageWidth] = useState(0);
  const [index, setIndex] = useState(0);

  // Measure the container width (inside Card it's ~90% of screen)
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
  const renderItem = useCallback(
    ({ item: [name, v] }) => {
      return (
        <View
          style={{
            width: pageWidth,
            flexDirection: "column",
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              fontSize: RFValue(25),
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {name}
          </Text>
          <View style={{ marginTop: height * 0.03, gap: height * 0.05 }}>
            {Object.entries(v)
              .slice(0, 4)
              .map(([ex, details]) => {
                return (
                  <View style={{ flexDirection: "column" }} key={ex}>
                    <Text
                      style={{
                        alignSelf: "flex-start",
                        fontSize: RFValue(15),
                        fontFamily: "Inter_600SemiBold",
                      }}
                    >
                      {ex}
                    </Text>
                    <AdherenceBar
                      planned={details.planned}
                      actual={details.actual}
                    ></AdherenceBar>
                  </View>
                );
              })}
          </View>
          {/* Bottom interactive footer button */}
          <TouchableOpacity
            onPress={onSeeAll}
            activeOpacity={0.7}
            style={{
              alignSelf: "flex-end",
              marginTop: 25,
              paddingHorizontal: 8,
              paddingVertical: 6,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(0,0,0,0.04)",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                color: "black",
                fontSize: RFValue(12),
              }}
            >
              See all
            </Text>
            <FontAwesome5
              name="chevron-right"
              size={RFValue(10)}
              color="black"
            />
          </TouchableOpacity>
        </View>
      );
    },
    [adh, pageWidth]
  );

  return (
    Object.entries(adh).length && (
      <Card
        style={{ width: "90%", alignSelf: "center", marginTop: height * 0.02 }}
        height={120}
        title={"Goal Adherence"}
        subtitle={"Actual / Planned reps per exercise "}
        titleColor="#000000ff"
        subtitleColor="#797979ff"
        iconColor="black"
        iconName={"target"}
        useBorder={true}
        borderWidth={0}
      >
        <View style={{ flexDirection: "column", marginTop: 10 }}>
          <FlatList
            data={data}
            onLayout={onLayout}
            renderItem={({ item: [name, v] }) =>
              renderItem({ item: [name, v] })
            }
            keyExtractor={([name, v]) => name}
            horizontal
            pagingEnabled
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
          ></FlatList>
          <PageDots index={index} length={data.length} />
        </View>
      </Card>
    )
  );
};

export default adhumeAttendence;
