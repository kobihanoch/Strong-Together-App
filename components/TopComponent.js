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
import { useNotifications } from "../context/NotificationsContext";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

const TopComponent = () => {
  const { user } = useAuth();
  const { unreadMessages } = useNotifications();
  const [msgCount, setMsgCount] = useState();
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    if (user && unreadMessages) {
      setUsername(user.username);
      setFullname(user.name);
      setProfileImageUrl(user.profile_image_url);
      setMsgCount(unreadMessages.length);
    }
  }, [user, unreadMessages]);

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
              fontFamily: "Inter_600SemiBold",
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
      <View style={{ flexDirection: "row", gap: width * 0.02 }}>
        <TouchableOpacity style={{ marginBottom: height * 0.02 }}>
          <MaterialCommunityIcons
            name={"bell"}
            size={RFValue(20)}
            color={"#1A1A1A"}
            opacity={0.8}
          ></MaterialCommunityIcons>
          <View
            style={{
              backgroundColor: "#EF4444",
              height: height * 0.015,
              borderRadius: height * 0.05,
              aspectRatio: 1,
              position: "absolute",
              bottom: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
              opacity: msgCount == 0 ? 0 : 1,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: RFValue(6),
                fontFamily: "Inter_600SemiBold",
              }}
            >
              {msgCount > 99 ? "!" : msgCount}
            </Text>
          </View>
        </TouchableOpacity>
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
    height: height * 0.06,
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
