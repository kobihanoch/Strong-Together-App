import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
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

const Login = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const {
    needToVerify = false,
    email = null,
    password_ = null,
    username_ = null,
  } = route.params || {};

  useEffect(() => {
    if (route.params && password_ && username_) {
      console.log("Setting params", { password_, username_ });
      setUsername(username_);
      setPassword(password_);
    }
  }, [route.params]);

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
            {needToVerify ? (
              <View style={styles.verifyCard}>
                <View style={styles.verifyIconCircle}>
                  <MaterialCommunityIcons
                    name="email-check-outline"
                    size={RFValue(28)}
                    color="#2ecc71"
                  />
                </View>

                <Text style={styles.verifyTitle}>An email has been sent</Text>
                <Text style={styles.verifySubtitle}>
                  Please check your inbox:
                </Text>
                <Text style={styles.verifyEmail}>{email}</Text>

                <View style={styles.verifyButtons}>
                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={handleLogin}
                  >
                    <Text style={styles.btnPrimaryText}>Log in</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={styles.btnSecondaryText}>Change email</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.verifyHint}>
                  It can take up to a minute. Also check your spam folder.
                </Text>
              </View>
            ) : (
              <>
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
              </>
            )}
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
  verifyCard: {
    width: width * 0.85,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.25)",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  verifyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  verifyTitle: {
    fontSize: 26,
    color: "white",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  verifySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  verifyEmail: {
    marginTop: 4,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  verifyButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  btnPrimary: {
    backgroundColor: "#f0f0f0",
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.06,
    borderRadius: 24,
  },
  btnPrimaryText: {
    color: "#007bff",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  btnSecondary: {
    borderColor: "rgba(255,255,255,0.7)",
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.06,
    borderRadius: 24,
  },
  btnSecondaryText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  verifyHint: {
    marginTop: 12,
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
