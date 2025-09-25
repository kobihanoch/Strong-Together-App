import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
  const msgCount = unreadMessages?.length;
  const fullname = user?.name;
  const profileImageUrl = user?.profile_image_url;

  // Animations
  const scaleAnim = useState(new Animated.Value(1))[0];
  useEffect(() => {
    if (unreadMessages) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 2,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp), // Slow start → fast end
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.in(Easing.circle), // Fast start → slow end
        }),
      ]).start();
    }
  }, [unreadMessages.length]);

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
          <View style={{}}>
            <Skeleton colorMode="light" width={150}>
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: RFValue(15),
                  color: "black",
                  opacity: 1,
                }}
              >
                Hello,
              </Text>
            </Skeleton>
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
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: width * 0.02,
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              marginBottom: 15,
              marginRight: 10,
              opacity: isLoading ? 0 : 1,
            }}
          >
            <TouchableOpacity
              style={{}}
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
                  backgroundColor: "#ff2979",
                  height: 15,
                  borderRadius: 50,
                  aspectRatio: 1,
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  justifyContent: "center",
                  alignItems: "center",
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderBottomWidth: 0,
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
