import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const QuickActions = ({ hasAssignedWorkout }) => {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quick Actions</Text>

      <View style={{ flexDirection: "column" }}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary, borderWidth: 0 },
          ]}
          onPress={() => nav.navigate("Analytics")}
        >
          <MaterialCommunityIcons
            name={"chart-timeline-variant-shimmer"}
            size={RFValue(20)}
            color={"white"}
            paddingHorizontal={4}
            paddingVertical={4}
            borderRadius={10}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={[styles.buttonHeader, { color: "white" }]}>
              Check out your analytics
            </Text>
            <Text style={[styles.buttonText, { color: colors.lightCardBg }]}>
              Trends, PRs, goal adherence
            </Text>
          </View>
          <MaterialCommunityIcons
            name={"arrow-right"}
            size={RFValue(20)}
            color={"white"}
            paddingHorizontal={4}
            paddingVertical={4}
            borderRadius={10}
            style={{ right: 10, position: "absolute" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => nav.navigate("CreateWorkout")}
        >
          <MaterialCommunityIcons
            name={hasAssignedWorkout ? "square-edit-outline" : "plus"}
            size={RFValue(20)}
            backgroundColor={colors.primaryLight}
            color={colors.primary}
            paddingHorizontal={4}
            paddingVertical={4}
            borderRadius={10}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.buttonHeader}>
              {hasAssignedWorkout ? "Edit your workout" : "Create your workout"}
            </Text>
            <Text style={styles.buttonText}>
              {hasAssignedWorkout
                ? "Adjust exercises & sets"
                : "Build a new plan"}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={"chevron-right"}
            size={RFValue(20)}
            color={colors.textSecondary}
            paddingHorizontal={4}
            paddingVertical={4}
            borderRadius={10}
            style={{ right: 10, position: "absolute" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => nav.navigate("Statistics")}
        >
          <MaterialCommunityIcons
            name={"history"}
            size={RFValue(20)}
            backgroundColor={colors.primaryLight}
            color={colors.primary}
            paddingHorizontal={4}
            paddingVertical={4}
            borderRadius={10}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.buttonHeader}>History</Text>
            <Text style={styles.buttonText}>All previous workouts</Text>
          </View>
          <MaterialCommunityIcons
            name={"chevron-right"}
            size={RFValue(20)}
            color={colors.textSecondary}
            paddingHorizontal={4}
            paddingVertical={4}
            borderRadius={10}
            style={{ right: 10, position: "absolute" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: height * 0.03,
    paddingHorizontal: height * 0.02,
    width: "90%",
    alignSelf: "center",
  },
  header: {
    fontFamily: "Inter_600SemiBold",
    color: "black",
    fontSize: RFValue(15),
  },
  button: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(17,24,39,0.06)",
    width: "100%",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  buttonHeader: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(13),
  },
  buttonText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(11),
    opacity: 0.7,
    marginTop: 2,
    color: colors.textSecondary,
  },
});

export default QuickActions;
