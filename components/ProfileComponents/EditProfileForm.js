import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import Column from "../Column";
import Row from "../Row";
import { TextInput } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { showErrorAlert } from "../../errors/errorAlerts";
import { updateSelfUser } from "../../services/UserService";
import { Notifier, NotifierComponents } from "react-native-notifier";

const EditProfileForm = ({
  initialData,
  closeEditSheet,
  openEditSheet,
  setUser,
}) => {
  const { fullName, gender, email, username } = initialData;
  const [fullNameInput, setFullNameInput] = useState(fullName);
  const [emailInput, setEmailInput] = useState(email);
  const [usernameInput, setUsernameInput] = useState(username);

  const [updating, setUpdating] = useState(false);

  const handleCancel = () => {
    setFullNameInput(fullName);
    setUsernameInput(username);
    setEmailInput(email);
    Keyboard.dismiss();
    closeEditSheet();
  };

  const handleSave = async () => {
    if (
      !fullNameInput ||
      fullNameInput.length === 0 ||
      !emailInput ||
      emailInput.length === 0 ||
      !usernameInput ||
      usernameInput.length === 0
    ) {
      showErrorAlert("Error Updating User", "Please fill all fields");
      return;
    }
    if (
      fullNameInput === fullName &&
      usernameInput === username &&
      emailInput === email
    ) {
      closeEditSheet();
      return;
    }
    const payload = {
      username: usernameInput === username ? undefined : usernameInput,
      fullName: fullNameInput === fullName ? undefined : fullNameInput,
      email: emailInput === email ? undefined : emailInput,
    };

    // Sets all user updated profile out of email (old email is showing)
    // Server sent an email request

    let res;
    try {
      setUpdating(true);
      res = await updateSelfUser(payload);
      setUser(res?.user);
      if (res?.emailChanged) {
        Notifier.showNotification({
          title: "An email has beent sent to you",
          description: `Please confirm this new email. Check ${emailInput} inbox or spam.`,
          duration: 7000,
          showAnimationDuration: 250,
          hideOnPress: true,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "success",
            titleStyle: { fontSize: 16 },
            descriptionStyle: { fontSize: 14 },
          },
        });
      } else {
        Notifier.showNotification({
          title: "User Updated",
          description: "Your profile changes has been updated successfully",
          duration: 2500,
          showAnimationDuration: 250,
          hideOnPress: true,
          Component: NotifierComponents.Alert,
          componentProps: {
            alertType: "success",
            titleStyle: { fontSize: 16 },
            descriptionStyle: { fontSize: 14 },
          },
        });
      }
      Keyboard.dismiss();
      closeEditSheet();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <Column style={{ padding: 15, paddingHorizontal: 20, gap: 20 }}>
          <Row>
            <Text style={styles.header}>Edit Profile</Text>
          </Row>

          <Row style={{ width: "100%", gap: 10 }}>
            <Column style={[styles.inputComponent, { width: "50%" }]}>
              <Text style={styles.inputHeader}>Full Name</Text>
              <TextInput
                style={styles.inputText}
                value={fullNameInput}
                onChangeText={setFullNameInput}
                maxLength={20}
                onFocus={() => openEditSheet(2)}
              />
            </Column>

            <Column style={[styles.inputComponent, { width: "50%" }]}>
              <Text style={styles.inputHeader}>Username</Text>
              <TextInput
                style={styles.inputText}
                value={usernameInput}
                onChangeText={setUsernameInput}
                maxLength={15}
                onFocus={() => openEditSheet(2)}
              />
            </Column>
          </Row>

          <Column style={styles.inputComponent}>
            <Text style={styles.inputHeader}>Email</Text>
            <TextInput
              style={styles.inputText}
              value={emailInput}
              onChangeText={setEmailInput}
              maxLength={50}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => openEditSheet(2)}
            />
          </Column>

          <Row style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.saveBtnContainer}
              onPress={handleSave}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator />
              ) : (
                <Row style={{ gap: 10 }}>
                  <MaterialCommunityIcons
                    name={"content-save-outline"}
                    size={RFValue(13)}
                    color={"white"}
                  />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </Row>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtnContainer}
              onPress={handleCancel}
              disabled={updating}
            >
              <Row style={{ gap: 10 }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Row>
            </TouchableOpacity>
          </Row>
        </Column>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Inter_600SemiBold",
    fontSize: RFValue(15),
    color: "black",
  },
  inputComponent: {
    gap: 5,
    alignItems: "flex-start",
  },
  inputHeader: {
    fontFamily: "Inter_500Medium",
    color: "black",
    fontSize: RFValue(13),
  },
  inputText: {
    fontFamily: "Inter_400Regular",
    color: "black",
    fontSize: RFValue(12),
    padding: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    textAlign: "left",
  },
  saveBtnContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  saveBtnText: {
    fontFamily: "Inter_500Medium",
    color: "white",
    fontSize: RFValue(13),
  },
  cancelBtnContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  cancelBtnText: {
    fontFamily: "Inter_400Regular",
    color: colors.textSecondary,
    fontSize: RFValue(13),
  },
});
export default EditProfileForm;
