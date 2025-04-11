import React from "react";
import { View, Text, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import MessageItem from "../components/InboxComponents/MessageItem";
import LoadingPage from "../components/LoadingPage";
import useInboxLogic from "../hooks/logic/useInboxLogic";
import { RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get("window");

const Inbox = () => {
  const { messages } = useInboxLogic();

  if (messages.loadingMessages) {
    return <LoadingPage message="Loading messages"></LoadingPage>;
  }
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
        <FlatList
          data={[...messages.allReceivedMessages].sort(
            (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
          )}
          renderItem={({ item }) => <MessageItem item={item}></MessageItem>}
          keyExtractor={(item) => item.id}
          style={{ width: "100%" }}
        ></FlatList>
      </View>
    </View>
  );
};

export default Inbox;
