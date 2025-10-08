import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  AppState,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RFValue } from "react-native-responsive-fontsize";
import InputField from "../InputField";
import { useAuth } from "../../context/AuthContext";
import { showErrorAlert } from "../../errors/errorAlerts";
import {
  changeEmail,
  checkUserVerify,
  sendVerificationMail,
} from "../../services/AuthService";

const { width, height } = Dimensions.get("window");

export default function VerifyCard({ username, password, initialEmail }) {
  // Auth context for login button + loading
  const { login, loading } = useAuth();

  // Displayed email and inline change-email form state
  const [displayEmail, setDisplayEmail] = useState(initialEmail || "");
  const [showChange, setShowChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [passwordForChangeEmail, setPasswordForChangeEmail] = useState("");
  const [changing, setChanging] = useState(false);

  // Resend verification: in-flight lock + visible cooldown
  const [isResendingVerify, setIsResendingVerify] = useState(false);
  const [verifyCooldown, setVerifyCooldown] = useState(0); // seconds
  const verifyCooldownUntilRef = useRef(null);
  const sendEmailLockRef = useRef(0); // soft session cap (e.g., 3)

  // Auto-login when returning from OS after verifying (phone flow)
  const timesAllowedRef = useRef(0);
  useEffect(() => {
    if (!username || !password) return;

    const sub = AppState.addEventListener("change", async (state) => {
      if (state !== "active") return;
      if (timesAllowedRef.current >= 3) return;

      const verified = await checkUserVerify(username);
      timesAllowedRef.current += 1;

      if (!verified) {
        showErrorAlert(
          "Not yet verified",
          "Please verify your email before logging in"
        );
        return;
      }
      await login(username, password);
    });

    return () => sub.remove();
  }, [username, password, login]);

  // Keep displayed email synced when prop changes
  useEffect(() => {
    setDisplayEmail(initialEmail || "");
  }, [initialEmail]);

  // Tick down the verification resend cooldown
  useEffect(() => {
    if (verifyCooldown <= 0) return;
    const id = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((verifyCooldownUntilRef.current - Date.now()) / 1000)
      );
      setVerifyCooldown(remaining);
      if (remaining === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [verifyCooldown]);

  // Handlers (component-owned)
  const handleLoginPress = async () => {
    if (!username || !password) {
      showErrorAlert(
        "Missing credentials",
        "Please go back and log in from the main form"
      );
      return;
    }
    const verified = await checkUserVerify(username);
    if (!verified) {
      showErrorAlert(
        "Not yet verified",
        "Please verify your email before logging in"
      );
      return;
    }
    await login(username, password);
  };

  const handleToggleChangeEmail = () => setShowChange((s) => !s);

  const changeEmailLockRef = useRef(0);
  const handleSubmitChangeEmail = async () => {
    if (!passwordForChangeEmail || !newEmail) {
      showErrorAlert("Error", "Please fill password and new email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      showErrorAlert("Invalid email", "Please enter a valid email address");
      return;
    }
    if (changeEmailLockRef.current >= 3) {
      showErrorAlert(
        "Too many requests",
        "You requested too many verification emails."
      );
      return;
    }

    setChanging(true);
    try {
      await changeEmail(username, passwordForChangeEmail, newEmail);
      changeEmailLockRef.current += 1;
      setDisplayEmail(newEmail);
      setNewEmail("");
      setShowChange(false);
    } finally {
      setChanging(false);
    }
  };

  const handleResendVerify = async () => {
    if (isResendingVerify || verifyCooldown > 0) return;

    if (sendEmailLockRef.current >= 3) {
      showErrorAlert(
        "Too many requests",
        "You requested too many verification emails."
      );
      return;
    }
    const targetEmail = displayEmail;
    if (!targetEmail) {
      showErrorAlert(
        "Missing email",
        "No email is available to send verification to"
      );
      return;
    }

    try {
      setIsResendingVerify(true);
      await sendVerificationMail(targetEmail);
      sendEmailLockRef.current += 1;

      const COOLDOWN_MS = 45_000;
      verifyCooldownUntilRef.current = Date.now() + COOLDOWN_MS;
      setVerifyCooldown(Math.ceil(COOLDOWN_MS / 1000));
    } catch (e) {
      // Optionally map 429 to friendly message
    } finally {
      setIsResendingVerify(false);
    }
  };

  return (
    <View style={styles.verifyCard}>
      {/* Success icon */}
      <View style={styles.verifyIconCircle}>
        <MaterialCommunityIcons
          name="email-check-outline"
          size={RFValue(28)}
          color="#2ecc71"
        />
      </View>

      {/* Headings */}
      <Text style={styles.verifyTitle}>An email has been sent</Text>
      <Text style={styles.verifySubtitle}>Please check your inbox:</Text>
      <Text style={styles.verifyEmail}>{displayEmail}</Text>

      {/* Actions */}
      <View style={styles.verifyButtons}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={handleLoginPress}
          disabled={loading}
        >
          <Text style={styles.btnPrimaryText}>I verified, log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={handleToggleChangeEmail}
        >
          <Text style={styles.btnSecondaryText}>Change email</Text>
        </TouchableOpacity>
      </View>

      {/* Change email inline form */}
      {showChange && (
        <View style={styles.changeForm}>
          <View style={{ marginTop: 8 }} />
          <InputField
            placeholder="Password"
            secureTextEntry
            value={passwordForChangeEmail}
            onChangeText={setPasswordForChangeEmail}
            iconName="lock"
          />
          <View style={{ marginTop: 8 }} />
          <InputField
            placeholder="New email"
            iconName="email"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[
              styles.btnPrimary,
              { marginTop: 12, opacity: changing ? 0.7 : 1 },
            ]}
            onPress={handleSubmitChangeEmail}
            disabled={changing}
          >
            <View style={styles.buttonContent}>
              {changing ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.btnPrimaryText}>Save & resend</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Hint + resend verify with cooldown */}
      <Text style={styles.verifyHint}>
        It can take up to a minute. Also check your spam folder.
      </Text>

      <TouchableOpacity
        onPress={handleResendVerify}
        disabled={isResendingVerify || verifyCooldown > 0}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {isResendingVerify ? <ActivityIndicator /> : null}
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: RFValue(13),
              color: "white",
              marginTop: 20,
              textDecorationLine: verifyCooldown > 0 ? "none" : "underline",
              opacity: verifyCooldown > 0 ? 0.6 : 1,
              marginLeft: isResendingVerify ? 8 : 0,
            }}
          >
            {verifyCooldown > 0
              ? `Resend verification in ${verifyCooldown}s`
              : "I didn't receive an email, Send me again"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign: "center",
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
  changeForm: {
    width: width * 0.85,
    marginTop: 14,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: height * 0.015,
  },
});
