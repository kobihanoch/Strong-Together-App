import React, { useCallback } from 'react';
import { Dimensions, ListRenderItem, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import MessageItem from './components/MessageItem';
import useInboxLogic from './hooks/use-inbox-logic.hook';
import { colors } from '../../shared/constants/colors';
import type { UserMessage } from '../../features/messages/types/messages.types';
import { usePullToRefresh } from '../../shared/hooks/use-pull-to-refresh.hook';
const { width } = Dimensions.get('window');
const inboxQueryNames = ['messages'];

const Inbox = () => {
  const { allReceivedMessages, confirmAndDeleteMessage, markAsRead, unreadMessagesCount } = useInboxLogic();
  const { isRefreshing, refresh } = usePullToRefresh(inboxQueryNames);

  const renderItem: ListRenderItem<UserMessage> = useCallback(
    ({ item }) => {
      return <MessageItem item={item} deleteMessage={confirmAndDeleteMessage} markAsRead={markAsRead} />;
    },
    [confirmAndDeleteMessage, markAsRead],
  );

  const keyExtractor = useCallback((item: UserMessage) => item.id, []);
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View
        style={{
          flex: 2,
          justifyContent: 'flex-end',
          paddingBottom: 20,
          backgroundColor: colors.lightCardBg,
        }}
      >
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
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
            fontFamily: 'Inter_400Regular',
            fontSize: RFValue(13),
            color: 'black',
            marginLeft: 15,
            marginBottom: 20,
          }}
        >
          You have{' '}
          <Text
            style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: RFValue(13),
              color: 'black',
            }}
          >
            {unreadMessagesCount}
          </Text>{' '}
          unread messages
        </Text>
        <FlatList
          data={allReceivedMessages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={{ width: '100%' }}
          contentContainerStyle={allReceivedMessages.length === 0 ? { flexGrow: 1 } : undefined}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={refresh}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: RFValue(18) }}>No messages yet</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default Inbox;
