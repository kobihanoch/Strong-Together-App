// Only English comments inside the code
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import InputField from "../components/InputField";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert } from "../errors/errorAlerts";
import { updateSelfUser } from "../services/UserService";
import { colors } from "../constants/colors";

const { width, height } = Dimensions.get("window");

const OAuthCompleteFields = ({ navigation, route }) => {
  const { handleAppleAuth, handleGoogleAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const { missingFields = [], provider = null } = route.params || {};
  const [isSending, setIsSending] = useState(false);

  const handleUpdateUserMissingFields = async () => {
    try {
      setIsSending(true);
      console.log(route.params);
      if (
        (missingFields.includes("email") && !email.length > 0) ||
        (missingFields.includes("name") && !fullName.length > 0)
      ) {
        showErrorAlert("Error", "Please fill all requested fields to continue");
        return;
      }

      await updateSelfUser({
        setCompletedOnOAuth: true,
        email: missingFields.includes("email") ? email : undefined,
        fullName: missingFields.includes("name") ? fullName : undefined,
      });

      provider === "google"
        ? await handleGoogleAuth(true)
        : await handleAppleAuth(true);
    } catch {
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>
          We need a few more details to finish setting up your account
        </Text>

        <View style={styles.inputsContainer}>
          {missingFields.includes("email") && (
            <InputField
              placeholder="Email"
              iconName="at"
              value={email}
              onChangeText={setEmail}
              textContentType="emailAddress"
              autoComplete="email"
            />
          )}
          {missingFields.includes("name") && (
            <InputField
              placeholder="Full name"
              iconName="pencil"
              value={fullName}
              onChangeText={setFullName}
              textContentType="name"
              autoComplete="name"
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleUpdateUserMissingFields}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonRegisterText}>Continue</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default OAuthCompleteFields;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.08,
  },
  title: {
    fontSize: RFValue(22),
    color: "white",
    fontWeight: "700",
    marginBottom: height * 0.015,
    textAlign: "center",
  },
  subtitle: {
    fontSize: RFValue(13),
    color: "rgba(255,255,255,0.8)",
    marginBottom: height * 0.04,
    textAlign: "center",
    lineHeight: RFValue(18),
    width: "80%",
  },
  inputsContainer: {
    width: "100%",
    gap: 0,
    marginBottom: height * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRegister: {
    backgroundColor: "#f0f0f0",
    height: height * 0.07,
    paddingHorizontal: width * 0.05,
    borderRadius: 18,
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
    height: height * 0.07,
    paddingHorizontal: width * 0.05,
    borderRadius: 18,
    alignSelf: "center",
    width: width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#d5e4f5",
    borderStyle: "solid",
    borderWidth: 1,
    marginTop: height * 0.02,
  },
  buttonLoginText: {
    fontSize: width * 0.04,
    color: "white",
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});
