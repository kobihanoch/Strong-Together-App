import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { useGlobalAppLoadingContext } from "../context/GlobalAppLoadingContext";
import { Skeleton } from "moti/skeleton";

const { width, height } = Dimensions.get("window");

const TopComponent = () => {
  // Context
  const { user, isWorkoutMode } = useAuth();
  const { unreadMessages } = useNotifications();
  const { isLoading } = useGlobalAppLoadingContext();

  // Navigation
  const navigation = useNavigation();

  // Properties
  const [msgCount, setMsgCount] = useState();
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // Image source
  const imgSrc = profileImageUrl
    ? {
        uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${profileImageUrl}`,
      }
    : user?.gender == "Male"
    ? require("../assets/man.png")
    : require("../assets/woman.png");

  // Animations
  const scaleAnim = useState(new Animated.Value(1))[0];
  useEffect(() => {
    if (unreadMessages) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.4,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [unreadMessages.length]);

  // On load
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
    <Skeleton.Group show={isLoading}>
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
          <Skeleton
            height={height * 0.06}
            width={height * 0.06}
            radius="round"
            colorMode="light"
          >
            <TouchableOpacity onPress={handleImagePress}>
              <Image
                source={
                  profileImageUrl
                    ? {
                        uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${profileImageUrl}`,
                      }
                    : user?.gender == "Male"
                    ? require("../assets/man.png")
                    : require("../assets/woman.png")
                }
                style={styles.profileImage}
                cachePolicy={profileImageUrl ? "disk" : "none"}
                transition={150}
              />
            </TouchableOpacity>
          </Skeleton>
          <View style={{ marginLeft: width * 0.04 }}>
            <Skeleton colorMode="light" height={20} width={100}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(17),
                  color: "black",
                }}
              >
                {isLoading ? "" : fullname}
              </Text>
            </Skeleton>
            <Skeleton colorMode="light" width={150}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: RFValue(12),
                  color: "black",
                  opacity: 0.7,
                }}
              >
                {isLoading ? "" : `@${username}`}
              </Text>
            </Skeleton>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: width * 0.02 }}>
          <TouchableOpacity
            style={{ marginBottom: height * 0.02 }}
            onPress={() => navigation.navigate("Inbox")}
            disabled={isWorkoutMode ? true : false}
          >
            <MaterialCommunityIcons
              name={"bell"}
              size={RFValue(20)}
              color={"#1A1A1A"}
              opacity={isWorkoutMode ? 0 : 0.8}
            ></MaterialCommunityIcons>
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
                backgroundColor: "#EF4444",
                height: height * 0.015,
                borderRadius: height * 0.05,
                aspectRatio: 1,
                position: "absolute",
                bottom: 0,
                right: 0,
                justifyContent: "center",
                alignItems: "center",
                opacity: isWorkoutMode ? 0 : msgCount == 0 ? 0 : 1,
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
            </Animated.View>
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
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={closeModal}
            >
              <Image
                source={
                  profileImageUrl
                    ? {
                        uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${profileImageUrl}`,
                      }
                    : user?.gender == "Male"
                    ? require("../assets/man.png")
                    : require("../assets/woman.png")
                }
                style={styles.enlargedImage}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    direction: "ltr",
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
    contentFit: "stretch",
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
