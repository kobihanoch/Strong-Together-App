import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { fontFamilies, fontSizes } from '../constants/typography';
import { useAppTheme } from '../providers/AppThemeProvider';
import { registerUpdateModal, unregisterUpdateModal } from '../utils/imperative-update-modal';

const APP_STORE_URL = 'itms-apps://itunes.apple.com/app/id6745721821';

export default function UpdateAppModal() {
  const [open, setOpen] = useState(false);
  const { colors } = useAppTheme();
  const { width, height } = useWindowDimensions();
  const modalWidth = Math.min(width - Math.max(32, width * 0.1), 440);
  const modalPadding = Math.max(22, Math.min(width * 0.065, 30));

  useEffect(() => {
    registerUpdateModal({ open: () => setOpen(true), close: () => setOpen(false) });
    return unregisterUpdateModal;
  }, []);

  if (!open) return null;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={() => undefined}>
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          style={[
            styles.panel,
            {
              width: modalWidth,
              maxHeight: Math.min(height * 0.82, 560),
              padding: modalPadding,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primarySoft }]}>
            <MaterialCommunityIcons name="arrow-up-circle-outline" size={30} color={colors.primary} />
          </View>

          <Text style={[styles.eyebrow, { color: colors.primary }]}>NEW VERSION</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Update required</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            A newer version of Strong Together is ready. Update now to continue training with the latest improvements.
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open App Store to update"
            onPress={() => Linking.openURL(APP_STORE_URL)}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
          >
            <Text style={[styles.primaryButtonText, { color: colors.white }]}>Open App Store</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={colors.white} />
          </Pressable>
          <Text style={[styles.note, { color: colors.textSecondary }]}>The app will be available again after the update finishes.</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.52)', alignItems: 'center', justifyContent: 'center' },
  panel: { alignSelf: 'center', borderWidth: 1, borderRadius: 24 },
  iconContainer: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { marginTop: 24, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 2.2 },
  title: { marginTop: 7, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, lineHeight: 34 },
  body: { marginTop: 12, fontFamily: fontFamilies.regular, fontSize: fontSizes.body, lineHeight: 23 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 24 },
  primaryButton: { minHeight: 52, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryButtonText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  note: { marginTop: 13, textAlign: 'center', fontFamily: fontFamilies.regular, fontSize: fontSizes.label, lineHeight: 16 },
  pressed: { opacity: 0.78 },
});
