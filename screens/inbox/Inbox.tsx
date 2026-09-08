import React, { useCallback } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { UserMessage } from '../../features/messages/types/messages.types';
import { fontFamilies, fontSizes } from '../../shared/constants/typography';
import { usePullToRefresh } from '../../shared/hooks/use-pull-to-refresh.hook';
import MessageItem from './components/MessageItem';
import useInboxScreen from './hooks/use-inbox-screen.hook';

const inboxQueryNames = ['messages'];

const Inbox = () => {
  const { data, actions, loadingStates } = useInboxScreen();
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(16, Math.min(width * 0.055, 24));
  const { isRefreshing, refresh } = usePullToRefresh(inboxQueryNames);

  const renderItem: ListRenderItem<UserMessage> = useCallback(
    ({ item }) => (
      <MessageItem
        item={item}
        theme={data.theme}
        isOpen={data.selectedMessageId === item.id}
        onOpen={actions.openMessage}
        onClose={actions.closeMessage}
        onDelete={actions.confirmAndDeleteMessage}
      />
    ),
    [actions.closeMessage, actions.confirmAndDeleteMessage, actions.openMessage, data.selectedMessageId, data.theme],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: data.theme.canvas }]} edges={['top']}>
      <FlatList
        data={data.allReceivedMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: gutter, paddingBottom: Math.max(28, height * 0.04) },
          !loadingStates.isPending && data.allReceivedMessages.length === 0 && styles.emptyContent,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={data.theme.primary} />}
        ListHeaderComponent={
          <View
            style={[
              styles.header,
              {
                paddingTop: Math.max(10, Math.min(height * 0.015, 14)),
                paddingBottom: Math.max(24, Math.min(height * 0.04, 34)),
              },
            ]}
          >
            <Text style={[styles.eyebrow, { color: data.theme.textSecondary }]}>MESSAGES</Text>
            <Text style={[styles.title, { color: data.theme.textPrimary }]}>Inbox</Text>
            <Text style={[styles.summary, { color: data.theme.textSecondary }]}>
              {data.unreadMessagesCount === 0
                ? 'You are all caught up.'
                : `${data.unreadMessagesCount} unread ${data.unreadMessagesCount === 1 ? 'message' : 'messages'}`}
            </Text>
            {data.allReceivedMessages.length > 0 ? (
              <Text style={[styles.sectionLabel, { color: data.theme.textSecondary }]}>RECENT MESSAGES</Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loadingStates.isPending ? (
            <ActivityIndicator style={styles.loader} size="large" color={data.theme.primary} />
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: data.theme.primarySoft }]}>
                <MaterialCommunityIcons name="email-check-outline" size={25} color={data.theme.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: data.theme.textPrimary }]}>No messages yet</Text>
              <Text style={[styles.emptyCopy, { color: data.theme.textSecondary }]}>Coaching and account updates will appear here.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flexGrow: 1 },
  emptyContent: { flexGrow: 1 },
  header: {},
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 3 },
  title: { marginTop: 2, fontFamily: fontFamilies.bold, fontSize: fontSizes.hero },
  summary: { marginTop: 8, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  sectionLabel: { marginTop: 34, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 1.6 },
  loader: { marginTop: 64 },
  emptyState: {
    flex: 1,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  emptyIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.title },
  emptyCopy: {
    maxWidth: 260,
    marginTop: 7,
    textAlign: 'center',
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodySmall,
    lineHeight: 19,
  },
});

export default Inbox;
