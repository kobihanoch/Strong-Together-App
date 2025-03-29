import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import supabase from "../src/supabaseClient";
import Icon from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { RFValue } from "react-native-responsive-fontsize";
import MostCommonWorkoutSummaryCard from "../components/HomeComponents/MostCommonWorkoutSummaryCard";
import WorkoutCountCard from "../components/HomeComponents/WorkoutCountCard";
import { useUserWorkout } from "../hooks/useUserWorkout";
import LoadingPage from "../components/LoadingPage";
import CreateOrEditWorkoutCard from "../components/HomeComponents/CreateOrEditWorkoutCard";
import NewAchivementCard from "../components/HomeComponents/NewAchivementCard";
import useHomePageLogic from "../hooks/logic/useHomePageLogic";
import useStatisticsPageLogic from "../hooks/logic/useStatisticsPageLogic";

const { width, height } = Dimensions.get("window");

const StatisticsPage = () => {
  const { user } = useAuth();
  const { splitsCount } = useStatisticsPageLogic(user);

  return (
    <View>
      <Text>Splits count: {splitsCount}</Text>
    </View>
  );
};

export default StatisticsPage;
