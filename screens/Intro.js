import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Logo from "../components/Logo";

const { width, height } = Dimensions.get("window");

const Intro = ({ navigation }) => {
  return (
    <LinearGradient colors={["#007bff", "#004fa3"]} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: height * 0.2,
            flex: 1,
          }}
        >
          <Logo />

          <View style={{ alignItems: "center", marginTop: height * 0.15 }}>
            <Text style={styles.descriptionText}>
              Enjoy a full world of health, now for free. {"\n"} Don't forget to
              bring your friends!
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={{ flexDirection: "column", marginTop: 0 }}>
            <TouchableOpacity
              style={styles.buttonRegister}
              onPress={() => navigation.navigate("Register")}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonRegisterText}>Register</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={() => navigation.navigate("Login")}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonLoginText}>Log in</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.aboutUs}
              onPress={() => navigation.navigate("Login")}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.aboutUsText}>About us</Text>
                <Icon
                  name="question-circle"
                  size={width * 0.04}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Intro;

const styles = StyleSheet.create({
  descriptionText: {
    textAlign: "center",
    fontSize: width * 0.04,
    color: "white",
  },
  divider: {
    height: 0.2,
    width: width * 0.7,
    backgroundColor: "white",
    marginTop: height * 0.05,
    marginBottom: height * 0.08,
  },
  buttonRegister: {
    backgroundColor: "#f0f0f0",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    width: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: height * 0.013,
  },
  buttonRegisterText: {
    fontSize: width * 0.04,
    color: "#007bff",
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
  },
  buttonLogin: {
    backgroundColor: "transparent",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    alignSelf: "center",
    width: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#d5e4f5",
    borderStyle: "solid",
    borderWidth: 1,
    marginTop: height * 0.03,
  },
  buttonLoginText: {
    fontSize: width * 0.04,
    color: "white",
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  aboutUs: {
    marginTop: height * 0.03,
    justifyContent: "center",
    alignItems: "center",
  },
  aboutUsText: {
    color: "white",
    marginRight: 10,
    fontSize: width * 0.04,
  },
});
