// English comments only inside the code

import React, { useMemo } from "react";
import { Dimensions, Text, View, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { FontAwesome5 } from "@expo/vector-icons";
import { AdherenceBar } from "../AdherenceBar";

const { height } = Dimensions.get("window");

export default function RenderGoalAdherenceItem({
  name,
  v,
  pageWidth,
  onSeeAll,
  showSeeAll = false,
  limit, // optional: limit items in the Card; omit in modal to show all
}) {
  const containerWidth = pageWidth || "100%";
  const entries = useMemo(() => Object.entries(v), [v]);
  const visibleEntries = useMemo(
    () => (typeof limit === "number" ? entries.slice(0, limit) : entries),
    [entries, limit]
  );

  return (
    <View style={{ width: containerWidth, flexDirection: "column" }}>
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
        {visibleEntries.map(([ex, details]) => (
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
            <AdherenceBar planned={details.planned} actual={details.actual} />
          </View>
        ))}
      </View>

      {showSeeAll && (
        <TouchableOpacity
          onPress={() => onSeeAll?.(name, v)} // ← pass selected entry
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
          <FontAwesome5 name="chevron-right" size={RFValue(10)} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
}
