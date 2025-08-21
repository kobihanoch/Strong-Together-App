import React from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

const InputField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  iconName,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#e0efff"
      />
      <Icon
        name={iconName}
        size={width * 0.035}
        color="#e0efff"
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: height * 0.013, // התאמת ה-padding לגובה המסך
    marginVertical: height * 0.01, // התאמת המרווחים לגובה המסך
    backgroundColor: "transparent",
    width: width * 0.5, // רוחב רספונסיבי
  },
  input: {
    flex: 1,
    color: "white",
    paddingRight: width * 0.03, // מרווח דינמי בין האייקון לשדה הקלט
    fontFamily: "Inter_400Regular",
    fontSize: width * 0.04, // גודל פונט דינמי
    textAlign: "left",
  },
  icon: {
    marginRight: 0, // שמירת מרווח קבוע לאייקון
  },
});

export default InputField;
