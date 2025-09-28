import React, { useCallback } from "react";
import { Dimensions, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import MessageItem from "../components/InboxComponents/MessageItem";
import useInboxLogic from "../hooks/logic/useInboxLogic";
import { colors } from "../constants/colors";
const { width, height } = Dimensions.get("window");

const Inbox = () => {
  const {
    allReceivedMessages = [],
    confirmAndDeleteMessage,
    markAsRead,
    unreadMessagesCount = 0,
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
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View
        style={{
          flex: 2,
          justifyContent: "flex-end",
          paddingBottom: 20,
          backgroundColor: colors.lightCardBg,
        }}
      >
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
      <View style={{ flex: 8, marginTop: 20 }}>
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: RFValue(13),
            color: "black",
            marginLeft: 15,
            marginBottom: 20,
          }}
        >
          You have{" "}
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              fontSize: RFValue(13),
              color: "black",
            }}
          >
            {unreadMessagesCount}
          </Text>{" "}
          unread messages
        </Text>
        {allReceivedMessages.length != 0 ? (
          <FlatList
            data={allReceivedMessages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
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
