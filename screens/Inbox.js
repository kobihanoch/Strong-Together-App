import React from "react";
import { Dimensions, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import MessageItem from "../components/InboxComponents/MessageItem";
import useInboxLogic from "../hooks/logic/useInboxLogic";
const { width, height } = Dimensions.get("window");

const Inbox = () => {
  const { messages, media } = useInboxLogic();
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flex: 1.5, justifyContent: "center" }}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: RFValue(25),
            marginLeft: width * 0.05,
          }}
        >
          Inbox
        </Text>
      </View>
      <View style={{ flex: 8.5 }}>
        {messages.allReceivedMessages.length != 0 ? (
          <FlatList
            data={[...messages.allReceivedMessages].sort(
              (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
            )}
            renderItem={({ item }) => (
              <MessageItem
                item={item}
                profileImages={media.profileImagesCache}
                sender={{
                  id: item.sender_id,
                  name: item.sender_full_name,
                }}
                deleteMessage={messages.confirmAndDeleteMessage}
              ></MessageItem>
            )}
            keyExtractor={(item) => item.id}
            style={{ width: "100%" }}
          ></FlatList>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{ fontFamily: "Inter_600SemiBold", fontSize: RFValue(18) }}
            >
              No messages yet
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Inbox;
