import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { UserMessage } from '../../../features/messages/types/messages.types';
import { colors } from '../../../shared/constants/colors';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { formatDate } from '../../../shared/utils/shared-utils';

type MessageItemProps = {
  item: UserMessage;
  theme: AppThemeColors;
  isOpen: boolean;
  onOpen: (message: UserMessage) => void;
  onClose: () => void;
  onDelete: (messageId: UserMessage['id']) => void;
};

const MessageItem = ({ item, theme, isOpen, onOpen, onClose, onDelete }: MessageItemProps) => {
  const { width, height } = useWindowDimensions();
  const rowPadding = Math.max(14, Math.min(width * 0.04, 18));
  const avatarSize = Math.max(40, Math.min(width * 0.11, 48));
  const modalPadding = Math.max(18, Math.min(width * 0.06, 26));
  const senderName = item.senderFullName || 'Strong Together';
  const imageSource = item.senderProfilePicPath
    ? `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.senderProfilePicPath}`
    : undefined;
  const sentDate = formatDate(item.sentAt.split('T')[0]);
  const message = item.msg ?? '';

  const renderRightActions = () => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Delete ${item.subject}`}
      onPress={() => onDelete(item.id)}
      style={[styles.deleteAction, { minHeight: Math.max(108, Math.min(height * 0.145, 126)), borderBottomColor: theme.border }]}
    >
      <MaterialCommunityIcons name="trash-can-outline" color={theme.white} size={22} />
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  return (
    <>
      <Swipeable renderRightActions={renderRightActions} overshootRight={false} friction={2}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${item.isRead ? '' : 'Unread message. '}${item.subject}`}
          onPress={() => onOpen(item)}
          style={({ pressed }) => [
            styles.row,
            {
              minHeight: Math.max(108, Math.min(height * 0.145, 126)),
              paddingVertical: rowPadding,
              borderBottomColor: theme.border,
            },
            pressed && styles.pressed,
          ]}
        >
          <View
            style={[
              styles.avatar,
              { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, backgroundColor: theme.surfaceMuted },
            ]}
          >
            {imageSource ? (
              <Image source={imageSource} style={styles.avatarImage} cachePolicy="disk" transition={150} />
            ) : (
              <MaterialCommunityIcons name="account-outline" size={21} color={theme.textSecondary} />
            )}
          </View>

          <View style={styles.copy}>
            <View style={styles.metaRow}>
              <Text numberOfLines={1} style={[styles.sender, { color: theme.textSecondary }]}>
                {senderName}
              </Text>
              <Text style={[styles.date, { color: theme.textSecondary }]}>{sentDate}</Text>
            </View>
            <Text numberOfLines={1} style={[styles.subject, { color: theme.textPrimary }, !item.isRead && styles.unreadText]}>
              {item.subject}
            </Text>
            <Text numberOfLines={2} style={[styles.preview, { color: theme.textSecondary }]}>
              {message}
            </Text>
          </View>

          {!item.isRead ? <View accessibilityLabel="Unread" style={[styles.unreadDot, { backgroundColor: theme.primary }]} /> : null}
        </Pressable>
      </Swipeable>

      <Modal visible={isOpen} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[
              styles.modalSheet,
              {
                backgroundColor: theme.surface,
                paddingHorizontal: modalPadding,
                paddingBottom: Math.max(24, Math.min(height * 0.05, 42)),
              },
            ]}
          >
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
            <View style={styles.modalHeader}>
              <View style={[styles.modalAvatar, { backgroundColor: theme.surfaceMuted }]}>
                {imageSource ? (
                  <Image source={imageSource} style={styles.avatarImage} cachePolicy="disk" transition={150} />
                ) : (
                  <MaterialCommunityIcons name="account-outline" size={25} color={theme.textSecondary} />
                )}
              </View>
              <View style={styles.modalIdentity}>
                <Text style={[styles.modalSender, { color: theme.textPrimary }]}>{senderName}</Text>
                <Text style={[styles.modalDate, { color: theme.textSecondary }]}>{sentDate}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close message"
                hitSlop={10}
                onPress={onClose}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={23} color={theme.textSecondary} />
              </Pressable>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <ScrollView style={styles.messageScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.messageContent}>
              <Text style={[styles.messageLabel, { color: theme.textSecondary }]}>MESSAGE</Text>
              <Text style={[styles.modalSubject, { color: theme.textPrimary }]}>{item.subject}</Text>
              <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>{message}</Text>
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.doneButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}
            >
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.subject}`}
              onPress={() => onDelete(item.id)}
              style={({ pressed }) => [styles.modalDeleteButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={19} color={colors.error} />
              <Text style={styles.modalDeleteText}>Delete message</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
  },
  pressed: { opacity: 0.76 },
  avatar: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  copy: { flex: 1, minWidth: 0 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  sender: { flex: 1, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  date: { fontFamily: fontFamilies.regular, fontSize: fontSizes.caption },
  subject: { marginTop: 6, fontFamily: fontFamilies.medium, fontSize: fontSizes.body, lineHeight: 21 },
  unreadText: { fontFamily: fontFamilies.bold },
  preview: { marginTop: 4, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, lineHeight: 19 },
  unreadDot: { width: 8, height: 8, marginTop: 5, borderRadius: 4 },
  deleteAction: {
    width: 86,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  deleteText: { color: colors.white, fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.48)', justifyContent: 'flex-end' },
  modalSheet: { width: '100%', maxHeight: '88%', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 14 },
  modalHeader: { flexDirection: 'row', alignItems: 'center' },
  modalAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  modalIdentity: { flex: 1, marginLeft: 13 },
  modalSender: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  modalDate: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  divider: { height: StyleSheet.hairlineWidth, marginTop: 18 },
  messageScroll: { flexShrink: 1 },
  messageContent: { paddingTop: 22, paddingBottom: 4 },
  messageLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 2 },
  modalSubject: { marginTop: 7, fontFamily: fontFamilies.bold, fontSize: fontSizes.title, lineHeight: 25 },
  modalMessage: { marginTop: 12, fontFamily: fontFamilies.regular, fontSize: fontSizes.body, lineHeight: 23 },
  doneButton: { minHeight: 48, marginTop: 26, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  doneText: { color: colors.white, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  modalDeleteButton: {
    minHeight: 46,
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  modalDeleteText: { color: colors.error, fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
});

export default React.memo(MessageItem);
