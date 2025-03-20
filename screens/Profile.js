import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useUserWorkout } from "../hooks/useUserWorkout";
import LoadingPage from "../components/LoadingPage";

const { width, height } = Dimensions.get("window");

function Profile({ navigation }) {
  const { user, logout } = useAuth();
  const { userWorkout, loading, error } = useUserWorkout(user?.id);
  const [workoutSplits, setWorkoutSplits] = useState(null);

  useEffect(() => {
    (async () => {
      setWorkoutSplits(userWorkout[0].workoutsplits);
    })();
  }, [userWorkout]);

  return loading ? (
    <LoadingPage message="Loading user data..." />
  ) : (
    <View style={{ flex: 1, paddingVertical: height * 0.02 }}>
      <Text>{user?.username}</Text>
      <Text>{user?.email}</Text>
      <Text>{user?.name}</Text>
      <Text>Splits count: {workoutSplits?.length}</Text>
    </View>
  );
}

export default Profile;
