import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const TopComponent = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [profileImageUrl, SetProfileImageUrl] = useState(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setFullname(user.name);
      SetProfileImageUrl(user.profile_image_url);
    }
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleImagePress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <LinearGradient
      colors={["transparent", "transparent"]}
      style={styles.topContainer}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          flex: 0.5,
        }}
      >
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require("../assets/profile.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: width * 0.04 }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: RFValue(18),
              color: "black",
            }}
          >
            {fullname}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: RFValue(13),
              color: "black",
              opacity: 0.7,
            }}
          >
            @{username}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={{ paddingBottom: height * 0.02 }}>
        <MaterialCommunityIcons
          name={"bell"}
          size={RFValue(18)}
          color={"#1A1A1A"}
        ></MaterialCommunityIcons>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
            <Image
              source={
                profileImageUrl
                  ? { uri: profileImageUrl }
                  : require("../assets/profile.png")
              }
              style={styles.enlargedImage}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(219, 219, 219, 0.8)",
  },
  profileImage: {
    height: height * 0.07,
    aspectRatio: 1,
    resizeMode: "stretch",
    borderWidth: 0.5,
    borderRadius: 40,
    borderColor: "white",
  },
  logoImage: {
    height: height * 0.025,
    width: height * 0.025,
    resizeMode: "contain",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  enlargedImage: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: "contain",
  },
});

export default TopComponent;
