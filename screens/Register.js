import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import SelectField from "../components/SelectField";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("window");

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const { register, loading } = useAuth();

  const handleRegister = async () => {
    if (!hasErrors()) {
      await register(email, password, username, fullName, gender);
    }
  };

  const hasErrors = () => {
    if (!username || !email || !password || !gender || !fullName) {
      showErrorAlert("Error", "Please fill all fields.");
      return true;
    } else if (password != confirmPassword) {
      showErrorAlert("Error", "Passwords don't match");
      return true;
    }
    return false;
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
      <LinearGradient colors={["#007bff", "#004fa3"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, marginTop: height * 0.1 }}>
          <View
            style={{
              marginLeft: width * 0.05,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            <Text style={styles.welcomeText}>It's nice to meet!</Text>
            <Text style={styles.subText}>Join us now for free</Text>

            <View style={styles.divider} />

            <View style={styles.inputContainer}>
              <InputField
                placeholder="Username"
                iconName="account"
                value={username}
                onChangeText={setUsername}
              />
              <InputField
                placeholder="Email"
                iconName="at"
                value={email}
                onChangeText={setEmail}
              />
              <InputField
                placeholder="Full name"
                iconName="pencil"
                value={fullName}
                onChangeText={setFullName}
              />
              <SelectField
                iconName="gender-male"
                value={gender}
                onChange={setGender}
              />
              <InputField
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                iconName="lock"
              />
              <InputField
                placeholder="Confirm password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                iconName="lock"
              />
              <TouchableOpacity
                style={styles.buttonRegister}
                onPress={handleRegister}
              >
                <View style={styles.buttonContent}>
                  {loading ? (
                    <ActivityIndicator></ActivityIndicator>
                  ) : (
                    <Text style={styles.buttonRegisterText}>Register</Text>
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

const styles = StyleSheet.create({
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
    marginRight: width * 0.05,
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
    width: width * 0.9,
    textAlign: "center",
  },
  subText: {
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
    marginTop: height * 0.05,
  },
  buttonRegister: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  buttonRegisterText: {
    fontSize: 18,
    color: "#007bff",
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});

export default Register;
