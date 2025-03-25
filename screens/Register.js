import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";
import InputField from "../components/InputField";
import CryptoJS from "crypto-js";
import Validators from "../components/Validators";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import supabase from "../src/supabaseClient";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const { register } = useAuth();

  const handleRegister = async () => {
    const errorMessages = validateInputs();
    if (errorMessages.length === 0) {
      try {
        await register(email, password, username, fullName, gender);
      } catch (error) {
        console.error("Registration failed:", error.message);
      }
    } else {
      Alert.alert("Registration Failed", errorMessages.join("\n"));
    }
  };

  const validateInputs = () => {
    let errorMessages = [];

    // Validate username
    const usernameError = Validators({ value: username, type: "username" });
    if (usernameError) errorMessages.push(usernameError);

    // Validate email
    const emailError = Validators({ value: email.trim(), type: "email" });
    if (emailError) errorMessages.push(emailError);

    // Validate password
    const passwordError = Validators({ value: password, type: "password" });
    if (passwordError) errorMessages.push(passwordError);

    // Validate confirm password
    if (password !== confirmPassword) {
      errorMessages.push("Passwords do not match.");
    }

    return errorMessages;
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
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={{ flexDirection: "row" }}>
                <Icon name="arrow-left" size={20} color="white" />
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
                iconName="user"
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
              <InputField
                placeholder="Gender"
                iconName="venus-mars"
                value={gender}
                onChangeText={setGender}
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
                  <Text style={styles.buttonRegisterText}>Register</Text>
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
    fontFamily: "PoppinsRegular",
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
    fontFamily: "PoppinsRegular",
    width: width * 0.9,
    textAlign: "center",
  },
  subText: {
    fontSize: 20,
    color: "white",
    fontFamily: "PoppinsRegular",
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
    fontFamily: "PoppinsRegular",
  },
});

export default Register;
