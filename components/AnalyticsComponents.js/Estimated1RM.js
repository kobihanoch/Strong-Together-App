import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Card from "./Card";
import RenderEst1RMItem from "./RenderEst1RMItem";

const { width, height } = Dimensions.get("window");

const Estimated1RM = ({ rmData, hasData, onSeeAll }) => {
  const { rm } = rmData;

  return (
    <View>
      <Card
        style={{ width: "90%", alignSelf: "center", marginTop: height * 0.02 }}
        height={120}
        title={"Estimated PRs"}
        subtitle={"Applied from your records so far"}
        titleColor="#000000ff"
        subtitleColor="#797979ff"
        iconColor="black"
        iconName={"medal"}
        useBorder={true}
        borderWidth={0}
      >
        {/* Rows list */}
        <View
          style={{
            flexDirection: "column",
            marginTop: 10,
          }}
        >
          {hasData ? (
            <>
              {Object.entries(rm)
                .slice(0, 4)
                .map(([exId, recordData]) => (
                  <RenderEst1RMItem key={exId} k={exId} v={recordData} />
                ))}
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
            </>
          ) : (
            <>
              <View>
                <Text>No data</Text>
              </View>
            </>
          )}
        </View>
      </Card>
    </View>
  );
};

export default Estimated1RM;
