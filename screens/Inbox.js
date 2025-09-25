import React, { useCallback } from "react";
import { Dimensions, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import MessageItem from "../components/InboxComponents/MessageItem";
import useInboxLogic from "../hooks/logic/useInboxLogic";
const { width, height } = Dimensions.get("window");

const Inbox = () => {
  const {
    sortedMessages = [],
    confirmAndDeleteMessage,
    markAsRead,
  } = useInboxLogic() || {};

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <MessageItem
          item={item}
          deleteMessage={confirmAndDeleteMessage}
          markAsRead={markAsRead}
        />
      );
    },
    [confirmAndDeleteMessage]
  );

  const keyExtractor = useCallback((item) => item.id);
  return (
    <View
      style={{ flex: 1, flexDirection: "column", paddingTop: height * 0.07 }}
    >
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
        {sortedMessages.length != 0 ? (
          <FlatList
            data={sortedMessages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
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
