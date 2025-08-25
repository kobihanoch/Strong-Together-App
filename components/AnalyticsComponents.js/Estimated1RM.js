import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Card from "./Card";

const { width, height } = Dimensions.get("window");

const Estimated1RM = ({ rmData, onSeeAll, hasData }) => {
  const { rm } = rmData;
  return (
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
                <View
                  key={exId}
                  style={{
                    width: "100%",
                    marginTop: height * 0.01,
                    paddingHorizontal: 10,
                    alignSelf: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: "rgba(233, 233, 233, 1)",
                    borderWidth: 0.5,
                    borderRadius: width * 0.02,
                    height: height * 0.068,
                  }}
                >
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(0,0,0,0.04)",
                    }}
                  >
                    <FontAwesome5
                      name="dumbbell"
                      size={RFValue(12)}
                      color="black"
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "column",
                      paddingLeft: 15,
                      flex: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        color: "black",
                        fontSize: RFValue(13),
                      }}
                    >
                      {recordData.exercise}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "black",
                        fontSize: RFValue(10),
                        opacity: 0.5,
                        marginTop: 3,
                      }}
                    >
                      {recordData.pr_weight} x {recordData.pr_reps}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "column", flex: 3 }}>
                    <Text
                      style={{
                        fontFamily: "Inter_700Bold",
                        color: "black",
                        fontSize: RFValue(13),
                        textAlign: "right",
                      }}
                    >
                      {recordData.max_1rm} kg
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        color: "black",
                        fontSize: RFValue(8),
                        textAlign: "right",
                      }}
                    >
                      Est. 1RM
                    </Text>
                  </View>
                </View>
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
  );
};

export default Estimated1RM;
