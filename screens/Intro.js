import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Logo from "../components/Logo";
import Row from "../components/Row";
import { Image } from "expo-image";
import Column from "../components/Column";

const { width, height } = Dimensions.get("window");

const Intro = ({ navigation }) => {
  return (
    <LinearGradient colors={["#007bff", "#004fa3"]} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: height * 0.15,
            flex: 1,
          }}
        >
          <Logo />

          <View style={{ alignItems: "center", marginTop: height * 0.05 }}>
            <Text style={styles.descriptionText}>
              Welcome to Strong Together.{"\n"}Your goals - powered by your
              circle.
            </Text>
          </View>

          <View style={styles.divider} />

          <Column
            style={{
              alignItems: "center",
            }}
          >
            <Column
              style={{
                alignItems: "center",
                gap: 15,
              }}
            >
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
            </Column>

            <Text
              style={{
                marginVertical: height * 0.04,
                fontSize: RFValue(12),
                color: "white",
                fontFamily: "Inter_400Regular",
                opacity: 0.8,
              }}
            >
              Or, continue with
            </Text>

            <Column
              style={{
                alignItems: "center",
                gap: 15,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.buttonLogin,
                  {
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    backgroundColor: "black",
                    borderColor: "black",
                  },
                ]}
                onPress={() => navigation.navigate("Login")}
              >
                <Row
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: height * 0.065,
                    paddingHorizontal: width * 0.05,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"apple"}
                    size={24}
                    color={"white"}
                  ></MaterialCommunityIcons>
                  <Text
                    style={[
                      styles.buttonLoginText,
                      { color: "white", fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    Sign in with Apple
                  </Text>
                </Row>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.buttonLogin,
                  {
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                    backgroundColor: "#F2F2F2",
                    borderColor: "#747775",
                    borderWidth: 1,
                  },
                ]}
                onPress={() => navigation.navigate("Login")}
              >
                <Row
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: height * 0.065,
                    paddingHorizontal: width * 0.05,
                  }}
                >
                  <Image
                    source={require("../assets/googleicon.png")}
                    style={{ height: 28, aspectRatio: 1 }}
                    contentFit="contain"
                    cachePolicy="disk"
                  />
                  <Text
                    style={[
                      styles.buttonLoginText,
                      { color: "black", fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    Sign in with Google
                  </Text>
                </Row>
              </TouchableOpacity>
            </Column>
            <TouchableOpacity
              style={styles.aboutUs}
              onPress={() =>
                Linking.openURL(
                  "https://kobihanoch.github.io/strongtogether-privacy/"
                )
              }
            >
              <View
                style={{ flexDirection: "row", gap: 7, alignItems: "center" }}
              >
                <MaterialCommunityIcons
                  name={"shield-lock"}
                  size={RFValue(15)}
                  color={"white"}
                ></MaterialCommunityIcons>

                <Text style={styles.aboutUsText}>Privacy Policy</Text>
              </View>
            </TouchableOpacity>
          </Column>
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
    fontFamily: "Inter_400Regular",
    fontSize: RFValue(11),
  },
  divider: {
    height: 0.5,
    width: width * 0.7,
    backgroundColor: "white",
    marginTop: height * 0.03,
    marginBottom: height * 0.05,
    opacity: 0.8,
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
