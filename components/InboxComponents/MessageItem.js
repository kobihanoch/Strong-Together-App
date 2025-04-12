import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDate } from "../../utils/statisticsUtils";
import { useUserData } from "../../hooks/useUserData";
import { updateMsgReadStatus } from "../../services/MessagesService";

const { width, height } = Dimensions.get("window");

const MessageItem = ({ item, profileImages, sender }) => {
  // Modal of message
  const [isModalVisible, setIsModalVisible] = useState(false);
  const imageSource =
    profileImages?.[sender?.id] ??
    (sender?.gender === "Male"
      ? require("../../assets/man.png")
      : require("../../assets/woman.png"));

  console.log("UI: Image source for sender:", imageSource);

  return (
    <TouchableOpacity
      style={{
        width: "95%",
        height: height * 0.16,
        paddingHorizontal: width * 0.04,
        alignSelf: "center",
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: "rgba(93, 93, 93, 0.3)",
      }}
      onPress={() => {
        updateMsgReadStatus(item.id);
        setIsModalVisible(true);
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          flex: 9,
          gap: height * 0.01,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: width * 0.02,
            alignItems: "center",
          }}
        >
          <Image
            source={imageSource}
            resizeMode="contain"
            style={{
              height: height * 0.03,
              width: height * 0.03,
              borderRadius: height * 0.04,
              backgroundColor: "#E0E0E0",
            }}
          ></Image>

          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(10) }}
          >
            {String(sender?.name)}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: item.is_read ? "Inter_400Regular" : "Inter_700Bold",
            fontSize: RFValue(15),
          }}
        >
          {item.subject}
        </Text>
        <Text
          style={{
            fontFamily: item.is_read ? "Inter_400Regular" : "Inter_700Bold",
            fontSize: RFValue(12),
          }}
        >
          {item.msg.length > 30 ? item.msg.substring(0, 30) + "..." : item.msg}
        </Text>
        <Text
          style={{
            fontFamily: item.is_read ? "Inter_400Regular" : "Inter_700Bold",
            fontSize: RFValue(12),
          }}
        >
          {formatDate(item.sent_at.split("T")[0])}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <MaterialCommunityIcons
          name={item.is_read ? "message-text-outline" : "message-text"}
          size={RFValue(15)}
        ></MaterialCommunityIcons>
      </View>
      {/*MODAL*/}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: width * 0.05,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              borderRadius: height * 0.02,
              padding: width * 0.05,
              elevation: 5,
            }}
          >
            {/* HEADER - SENDER INFO */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: height * 0.02,
              }}
            >
              <Image
                source={profileImages?.[sender?.id]}
                style={{
                  width: height * 0.05,
                  height: height * 0.05,
                  borderRadius: height * 0.025,
                  marginRight: width * 0.03,
                }}
              />
              <View>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    fontSize: RFValue(14),
                    color: "#111",
                  }}
                >
                  {sender?.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter_400Regular",
                    fontSize: RFValue(11),
                    color: "#666",
                  }}
                >
                  {formatDate(item.sent_at.split("T")[0])}
                </Text>
              </View>
            </View>

            {/* SUBJECT */}
            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: "Inter_700Bold",
                marginBottom: height * 0.015,
                color: "#222",
              }}
            >
              {item.subject}
            </Text>

            {/* MESSAGE */}
            <Text
              style={{
                fontSize: RFValue(14),
                fontFamily: "Inter_400Regular",
                color: "#333",
              }}
            >
              {item.msg}
            </Text>

            {/* CLOSE BUTTON */}
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                marginTop: height * 0.025,
                alignSelf: "flex-end",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  fontSize: RFValue(12),
                  color: "#007AFF",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default MessageItem;
