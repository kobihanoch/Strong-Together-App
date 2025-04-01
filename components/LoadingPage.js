// components/LoadingPage.js
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { height } = Dimensions.get("window");

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00142a" />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(20),
    marginTop: height * 0.05,
    color: "#00142a",
  },
});

export default LoadingPage;
