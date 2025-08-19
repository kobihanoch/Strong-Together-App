import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window"); // קבלת גדלי המסך

const Logo = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Strong. {"\n"}
        <Text style={styles.boldText}>Together.</Text>
      </Text>
      <Image
        source={require("../assets/logo_512.png")}
        style={styles.logoImage}
      />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: RFValue(40), // שומרים על גודל קבוע
    color: "white",
    textAlign: "right",
  },
  boldText: {
    fontWeight: "bold",
  },
  logoImage: {
    width: width * 0.3, // שומרים על גודל קבוע
    height: width * 0.3, // שומרים על גודל קבוע
    resizeMode: "contain",
  },
});
