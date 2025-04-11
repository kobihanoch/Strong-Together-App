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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDate } from "../../utils/statisticsUtils";
import { useUserData } from "../../hooks/useUserData";
import { updateMsgReadStatus } from "../../services/MessagesService";

const { width, height } = Dimensions.get("window");

const MessageItem = ({ item }) => {
  // Sender details
  const { userData } = useUserData(item.sender_id);

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
      onPress={() => updateMsgReadStatus(item.id)}
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
            source={
              userData?.profile_image_url
                ? { uri: userData?.profile_image_url }
                : require("../../assets/profile.png")
            }
            resizeMode="contain"
            style={{
              height: height * 0.03,
              aspectRatio: 1,
              borderRadius: height * 0.04,
              backgroundColor: "blue",
            }}
          ></Image>
          <Text
            style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(10) }}
          >
            {String(userData?.name)}
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
    </TouchableOpacity>
  );
};

export default MessageItem;
