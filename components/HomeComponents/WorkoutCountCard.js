import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");
function WorkoutCountCard({ totalWorkoutNumber }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: totalWorkoutNumber,
      duration: 1200,
      useNativeDriver: false,
    }).start(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [totalWorkoutNumber]);

  return (
    <View
      style={{
        flex: 3,
        height: "100%",
        borderRadius: height * 0.02,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: width * 0.04,
            marginTop: height * 0.02,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: RFValue(12),
              color: "black",
              alignSelf: "center",
            }}
          >
            Workouts
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: RFValue(20),
              color: "black",
              alignSelf: "center",
              marginTop: height * 0.03,
            }}
          >
            {displayValue}
          </Text>
        </Animated.View>

        <Text
          style={{
            fontSize: RFValue(10),
            color: "#666",
            alignSelf: "center",
            marginTop: height * 0.01,
          }}
        >
          Total workouts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutsContainer: {
    flex: 1,
    height: "100%",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: height * 0.02,
    paddingHorizontal: width * 0.04,
    opacity: 1,
  },
});

export default WorkoutCountCard;
