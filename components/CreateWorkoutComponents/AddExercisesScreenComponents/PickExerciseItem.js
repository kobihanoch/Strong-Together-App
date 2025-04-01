import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import images from "../../images";

const { width, height } = Dimensions.get("window");

const PickExerciseItem = ({ exercise, onSelectExercise, isSelected }) => {
  const mainMuscle = exercise.targetmuscle;
  const specificMuscle = exercise.specifictargetmuscle;
  const imagePath = images[mainMuscle]?.[specificMuscle];

  const getInitialSets = (exerciseSets) => {
    if (
      !exerciseSets ||
      !Array.isArray(exerciseSets) ||
      exerciseSets.length === 0
    ) {
      return ["10", "10", "10"];
    }
    return exerciseSets.map((set) =>
      isNaN(set) || set === "" ? "10" : set.toString()
    );
  };

  const [sets, setSets] = useState(getInitialSets(exercise.sets));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (
      exercise.sets &&
      JSON.stringify(exercise.sets) !== JSON.stringify(sets)
    ) {
      setSets(getInitialSets(exercise.sets));
    }
  }, [exercise.sets]);

  const handleSetChange = (index, value) => {
    setSets((prevSets) => {
      const newSets = [...prevSets];
      newSets[index] = value;
      return newSets;
    });
  };

  const handleSaveSets = () => {
    const sanitizedSets = sets.map((set) => (set.trim() === "" ? "10" : set));
    setSets(sanitizedSets);
    onSelectExercise({ ...exercise, sets: sanitizedSets });
    setIsEditing(false);
  };

  return (
    <TouchableOpacity
      onPress={() => onSelectExercise({ ...exercise, sets })}
      style={[
        styles.exerciseContainer,
        isSelected && { borderColor: "#0d2540", borderWidth: 2 },
      ]}
      activeOpacity={0.8}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 0.35, justifyContent: "center" }}>
          <LinearGradient
            colors={["#00142a", "#0d2540"]}
            style={styles.imageContainer}
          >
            <Image source={imagePath} style={styles.exerciseImage} />
          </LinearGradient>
        </View>

        <View style={styles.exerciseInfoContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.muscleText}>
            {exercise.targetmuscle}, {exercise.specifictargetmuscle}
          </Text>

          {isEditing ? (
            <View style={styles.editingContainer}>
              <View style={styles.inputsRow}>
                {sets.map((set, index) => (
                  <TextInput
                    key={index}
                    style={styles.editingInput}
                    keyboardType="numeric"
                    value={set}
                    onChangeText={(value) => handleSetChange(index, value)}
                    maxLength={2}
                  />
                ))}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveSets}
                >
                  <FontAwesome5 name="check" style={styles.saveButtonText} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.setsContainer}
              onPress={() => setIsEditing(true)}
            >
              {sets.map((set, index) => (
                <View key={index} style={styles.setBubble}>
                  <Text style={styles.setText}>{set}</Text>
                </View>
              ))}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.iconContainer}>
          <FontAwesome5
            name={isSelected ? "check-circle" : "info-circle"}
            size={18}
            color={isSelected ? "#0d2540" : "#00142a"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "#fafafa",
    width: "100%",
    alignSelf: "center",
    height: height * 0.16,
    flex: 1,
    borderRadius: width * 0.03,
    marginVertical: height * 0.005,
    borderColor: "transparent",
    borderWidth: 2,
    padding: width * 0.02,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: width * 0.02,
    borderWidth: 2,
    borderColor: "#666d75",
  },
  exerciseImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    opacity: 0.8,
  },
  exerciseInfoContainer: {
    flex: 0.55,
    justifyContent: "center",
    gap: height * 0.01,
    paddingLeft: width * 0.02,
  },
  exerciseName: {
    fontFamily: "Inter_700Bold",
    fontSize: RFValue(13),
    color: "black",
    width: "100%",
  },
  muscleText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(12),
    color: "#919191",
  },
  setsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  setBubble: {
    backgroundColor: "#0d2540",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  setText: {
    color: "white",
    fontSize: RFValue(12),
    fontFamily: "Inter_700Bold",
  },
  editingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  inputsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editingInput: {
    width: 40,
    height: 30,
    borderWidth: 2,
    borderColor: "#0d2540",
    borderRadius: 10,
    textAlign: "center",
    fontSize: RFValue(14),
    backgroundColor: "#fff",
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#0d2540",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: RFValue(14),
    fontFamily: "Inter_700Bold",
  },
  iconContainer: {
    flex: 0.1,
    marginRight: width * 0.04,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: height * 0.01,
  },
});

export default PickExerciseItem;
