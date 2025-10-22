import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RFValue } from "react-native-responsive-fontsize";
import VerifyCard from "../components/LoginComponents/VerifyCard";
import LoginForm from "../components/LoginComponents/LoginForm";
import { colors } from "../constants/colors";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation, route }) => {
  // Decide which child to render based on route params
  const {
    needToVerify = false,
    email = null,
    password_: routePassword = null,
    username_: routeUsername = null,
  } = route.params || {};

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, marginTop: height * 0.08 }}>
          {/* Top header */}
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

          {/* Body */}
          <View style={styles.body}>
            {needToVerify ? (
              <VerifyCard
                username={routeUsername}
                password={routePassword}
                initialEmail={email}
              />
            ) : (
              <LoginForm />
            )}
          </View>
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default Login;

/* ------------------------------ Parent styles ------------------------------ */
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
});
