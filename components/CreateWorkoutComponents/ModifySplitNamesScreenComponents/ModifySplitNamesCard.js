// ModifySplitNamesCard.js - Displays split names and their selected exercise counts
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const { width, height } = Dimensions.get("window");

function ModifySplitNamesCard({
  splitsNumber,
  setEditWorkoutSplitName,
  setStep,
}) {
  const [splitNames, setSplitNames] = useState(
    Array.from({ length: splitsNumber }, (_, i) => String.fromCharCode(65 + i))
  );

  return (
    <LinearGradient
      colors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        flexDirection: "column",
        borderRadius: width * 0.09,
        justifyContent: "center",
        alignItems: "center",
        gap: height * 0.04,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
      }}
    >
      <FlatList
        style={{ flex: 1, width: "100%" }}
        data={splitNames}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              borderRadius: height * 0.02,
              shadowOffset: { height: 0, width: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              backgroundColor: "#0d2540",
              width: "98%",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: height * 0.01,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                paddingLeft: width * 0.04,
                alignItems: "center",
                gap: width * 0.2,
                elevation: 4,
                height: height * 0.1,
                backgroundColor: "white",
                borderRadius: height * 0.02,
                flex: 6,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    fontFamily: "PoppinsBold",
                    color: "black",
                    fontSize: RFValue(30),
                  }}
                >
                  {item}
                </Text>
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    color: "black",
                    fontSize: RFValue(10),
                  }}
                >
                  No exercises
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                flex: 4,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: height * 0.01,
              }}
              onPress={() => {
                setEditWorkoutSplitName(item);
                setStep(3);
              }}
            >
              <View>
                <FontAwesome5
                  name="plus-circle"
                  size={RFValue(15)}
                  color={"white"}
                />
              </View>
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  fontSize: RFValue(10),
                  textAlign: "center",
                  color: "white",
                }}
              >
                Add exercises
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </LinearGradient>
  );
}

export default ModifySplitNamesCard;
