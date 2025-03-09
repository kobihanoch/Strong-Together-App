import React from "react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import WorkoutGenericBuildSettingsCard from "../components/CreateWorkoutComponents/Screens/PickSplitNumberScreenComponents/WorkoutGenericBuildSettingsCard";
import { RFValue } from "react-native-responsive-fontsize";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import GradientedGoToButton from "../components/GradientedGoToButton";
import { LinearGradient } from "expo-linear-gradient";
import PickSplitNumberScreen from "../components/CreateWorkoutComponents/Screens/PickSplitNumberScreen";
import ModifySplitNamesScreen from "../components/CreateWorkoutComponents/Screens/ModifySplitNamesScreen";
const { width, height } = Dimensions.get("window");

function CreateWorkout({ navigation }) {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [splitsNumber, setSplitsNumber] = useState(1);
  const [step, setStep] = useState(1);

  // Set username after user is laoded
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setUserId(user.id);
    }
  }, [user]);

  return (
    <LinearGradient
      colors={["#0d2540", "#123257"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        paddingVertical: height * 0.02,
      }}
    >
      {step === 1 && (
        <PickSplitNumberScreen
          setStep={setStep}
          setSplitsNumber={setSplitsNumber}
        />
      )}
      {step === 2 && (
        <ModifySplitNamesScreen setStep={setStep} splitsNumber={splitsNumber} />
      )}
    </LinearGradient>
  );
}

export default CreateWorkout;
