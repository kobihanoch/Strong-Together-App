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
    <LinearGradient colors={["#00142a", "#0d2540"]} style={styles.topContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
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
        <View style={{ marginLeft: width * 0.02 }}>
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: RFValue(12),
              color: "white",
            }}
          >
            {username}
          </Text>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: RFValue(10),
              color: "white",
              opacity: 0.7,
            }}
          >
            {fullname}
          </Text>
        </View>
      </View>
      <View style={{ flex: 0.5, alignItems: "flex-end" }}>
        <Image
          source={require("../assets/minilogoNew.png")}
          style={styles.logoImage}
        />
      </View>

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
    flex: 0.2,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.06,
  },
  profileImage: {
    height: height * 0.04,
    width: height * 0.04,
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
