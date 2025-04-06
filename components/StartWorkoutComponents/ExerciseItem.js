// ExerciseItem.js
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ProgressBar from "./ProgressBar.js";
import SetItem from "./SetItem";

const { width, height } = Dimensions.get("window");

const ExerciseItem = ({
  item,
  currentIndex,
  flatListHeight,
  currentSetIndex,
  glowAnimation,
  handleUpdateSet,
  innerFlatListRef,
  flatListRef,
  setFlatListHeight,
  setCurrentSetIndex,
}) => {
  const { sets, id: exercisetosplit_id } = item;
  const setsCount = Array.isArray(sets) ? sets.length : 0;
  const currentReps =
    sets && sets[currentSetIndex - 1] ? sets[currentSetIndex - 1] : "N/A";

  const renderSetItem = ({ index }) => (
    <SetItem
      index={index}
      sets={sets}
      flatListHeight={flatListHeight}
      exercisetosplit_id={exercisetosplit_id}
      handleUpdateSet={(exerciseId, weight, reps, setIndex) => {
        handleUpdateSet(exerciseId, weight, reps, setIndex);
        handleProgressUpdate(reps || 0);
      }}
    />
  );

  const [progress, setProgress] = useState(0);
  const handleProgressUpdate = (repsCompleted) => {
    const targetReps = sets[currentSetIndex - 1] || 1;
    const calculatedProgress = repsCompleted
      ? (repsCompleted / targetReps) * 100
      : 0;
    setProgress(calculatedProgress);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.exerciseContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
    >
      <LinearGradient
        colors={["#0d2540", "#00142a"]}
        style={styles.infoContainer}
      >
        <View style={{ flex: 0.2, alignItems: "center", opacity: 0.5 }}>
          <TouchableOpacity
            onPress={() =>
              currentIndex > 0 &&
              flatListRef.current.scrollToIndex({ index: currentIndex - 1 })
            }
          >
            <FontAwesome5
              name="arrow-left"
              color={currentIndex === 0 ? "transparent" : "white"}
              size={15}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 0.6 }}
        >
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDescription}>{item.description}</Text>
        </View>

        <View style={{ flex: 0.2, alignItems: "center", opacity: 0.5 }}>
          <TouchableOpacity
            onPress={() =>
              currentIndex < setsCount - 1 &&
              flatListRef.current.scrollToIndex({ index: currentIndex + 1 })
            }
          >
            <FontAwesome5
              name="arrow-right"
              color={currentIndex === setsCount - 1 ? "transparent" : "white"}
              size={15}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={{ flex: 0.6, backgroundColor: "white" }}>
        <View
          style={{
            flex: 0.4,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <LinearGradient
            colors={["#00142a", "#0A3D62"]}
            style={{
              justifyContent: "center",
              borderRadius: width * 0.06,
              height: "50%",
            }}
          >
            <View
              style={{
                borderRadius: width * 0.05,
                alignSelf: "center",
                alignItems: "center",
                paddingHorizontal: 25,
                width: "50%",
                height: "80%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: RFValue(15),
                  color: "#8ca7d1",
                  opacity: 0.7,
                }}
              >
                {setsCount} Sets
              </Text>
              <View
                style={{
                  height: 20,
                  backgroundColor: "white",
                  width: 1,
                  opacity: 0.2,
                }}
              ></View>
              <Animated.Text
                style={{
                  fontFamily: "Inter_700Bold",
                  fontSize: RFValue(14),
                  color: "#FACC15",
                  textAlign: "center",
                  textShadowColor: "#FACC15",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: glowAnimation.interpolate({
                    inputRange: [0, 50],
                    outputRange: [10, 35],
                  }),
                }}
              >
                {currentReps} reps
              </Animated.Text>
            </View>
          </LinearGradient>
          <View style={{ width: "49%", marginTop: -height * 0.018 }}>
            <ProgressBar progress={progress} />
          </View>
        </View>

        <View
          style={{
            flex: 0.6,
            marginBottom: height * 0.008,
            justifyContent: "flex-start",
          }}
        >
          <FlatList
            ref={innerFlatListRef}
            data={Array(setsCount).fill(null)}
            renderItem={renderSetItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            pagingEnabled
            onLayout={(event) =>
              setFlatListHeight(event.nativeEvent.layout.height)
            }
            onScroll={({ nativeEvent }) => {
              const newIndex =
                Math.round(nativeEvent.contentOffset.y / flatListHeight) + 1;
              setCurrentSetIndex(newIndex);
              const repsCompleted = parseInt(
                innerFlatListRef.current.repsInputRef?.current?.value || 0,
                10
              );
              handleProgressUpdate(repsCompleted || 0);
            }}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: { width, flex: 1, backgroundColor: "white" },
  infoContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  exerciseName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(20),
    color: "white",
    marginTop: height * 0.03,
  },
  exerciseDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(15),
    color: "#8ca7d1",
    marginTop: height * 0.01,
  },
});

export default ExerciseItem;
