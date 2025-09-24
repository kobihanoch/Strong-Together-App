import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert } from "../errors/errorAlerts";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    // Validate inputs
    if (password.length == 0 || username.length == 0) {
      showErrorAlert("Error", "Please fill username and password");
      return;
    }

    await login(username, password);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <LinearGradient colors={["#007bff", "#004fa3"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, marginTop: height * 0.08 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name={"arrow-left"}
                  size={RFValue(15)}
                  color={"white"}
                />
                <Text style={styles.introText}>Intro</Text>
              </View>
            </TouchableOpacity>
            <Image
              source={require("../assets/minilogoNew.png")}
              style={styles.logoImage}
            />
          </View>

          <View style={styles.body}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.loginText}>Log in now</Text>

            <View style={styles.divider} />

            <View style={styles.inputContainer}>
              <InputField
                placeholder="Username"
                iconName="account"
                value={username}
                onChangeText={setUsername}
              />
              <View style={{ marginTop: 0 }} />
              <InputField
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                iconName="lock"
              />
              <TouchableOpacity
                style={styles.buttonLogin}
                onPress={handleLogin}
                disabled={loading}
              >
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.buttonLoginText}>Log in</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  header: {
    marginLeft: width * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  introText: {
    justifyContent: "center",
    fontSize: 17,
    marginLeft: 10,
    color: "white",
    fontFamily: "Inter_400Regular",
  },
  logoImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: width * 0.055,
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  welcomeText: {
    fontSize: 40,
    color: "white",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  loginText: {
    fontSize: 20,
    color: "white",
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: 0.5,
    width: width * 0.7,
    backgroundColor: "white",
    marginTop: height * 0.05,
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: height * 0.15,
  },
  buttonLogin: {
    backgroundColor: "#f0f0f0",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.1,
    borderRadius: 25,
    width: width * 0.45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.04,
    opacity: 1,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: height * 0.015,
  },
  buttonLoginText: {
    fontSize: 18,
    color: "#007bff",
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});
