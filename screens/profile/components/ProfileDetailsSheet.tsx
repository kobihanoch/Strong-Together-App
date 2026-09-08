import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import { UpdateCurrentUserBody } from '@strong-together/shared';
import { showErrorAlert } from '../../../shared/alerts/error-alerts';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

type ProfileDraft = { fullName: string; username: string; email: string };
type Props = {
  initialData: ProfileDraft;
  onClose: () => void;
  onFocus: () => void;
  onSave: (payload: UpdateCurrentUserBody) => Promise<void>;
};

const ProfileDetailsSheet = ({ initialData, onClose, onFocus, onSave }: Props) => {
  const [draft, setDraft] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const gutter = Math.max(18, Math.min(width * 0.055, 26));

  useEffect(() => setDraft(initialData), [initialData]);

  const updateField = (field: keyof ProfileDraft) => (value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const cancel = () => {
    Keyboard.dismiss();
    setDraft(initialData);
    onClose();
  };

  const save = async () => {
    const normalized = { fullName: draft.fullName.trim(), username: draft.username.trim(), email: draft.email.trim().toLowerCase() };
    if (!normalized.fullName || !normalized.username || !normalized.email) {
      showErrorAlert('Check your details', 'Name, username, and email are required.');
      return;
    }

    const payload = {
      fullName: normalized.fullName === initialData.fullName ? undefined : normalized.fullName,
      username: normalized.username === initialData.username ? undefined : normalized.username,
      email: normalized.email === initialData.email.toLowerCase() ? undefined : normalized.email,
    };
    if (!payload.fullName && !payload.username && !payload.email) return cancel();

    try {
      setSaving(true);
      await onSave(payload);
      Notifier.showNotification({
        title: payload.email ? 'Confirmation email sent' : 'Profile updated',
        description: payload.email
          ? `Confirm your new address using the link sent to ${normalized.email}.`
          : 'Your changes are now live.',
        duration: payload.email ? 6500 : 2500,
        showAnimationDuration: 250,
        hideOnPress: true,
        Component: NotifierComponents.Alert,
        componentProps: { alertType: 'success' },
      });
      Keyboard.dismiss();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: gutter }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>PERSONAL DETAILS</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Edit profile</Text>
        </View>
        <Pressable onPress={cancel} hitSlop={12}><Text style={[styles.cancel, { color: colors.textSecondary }]}>Cancel</Text></Pressable>
      </View>

      <Field label="FULL NAME" value={draft.fullName} onChangeText={updateField('fullName')} onFocus={onFocus} colors={colors} />
      <Field label="USERNAME" value={draft.username} onChangeText={updateField('username')} onFocus={onFocus} autoCapitalize="none" colors={colors} />
      <Field label="EMAIL" value={draft.email} onChangeText={updateField('email')} onFocus={onFocus} autoCapitalize="none" keyboardType="email-address" colors={colors} />
      <Text style={[styles.helper, { color: colors.textSecondary }]}>Changing your email requires confirmation from the new address. Username and email availability are checked when you save.</Text>

      <Pressable disabled={saving} onPress={save} style={({ pressed }) => [styles.save, { backgroundColor: colors.primary, opacity: pressed || saving ? 0.65 : 1 }]}>
        {saving ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.saveText, { color: colors.white }]}>Save changes</Text>}
      </Pressable>
    </View>
  );
};

type FieldProps = React.ComponentProps<typeof TextInput> & { label: string; colors: ReturnType<typeof useAppTheme>['colors'] };
const Field = ({ label, colors, ...inputProps }: FieldProps) => (
  <View style={[styles.field, { borderBottomColor: colors.border }]}>
    <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    <TextInput {...inputProps} style={[styles.input, { color: colors.textPrimary }]} placeholderTextColor={colors.textSecondary} />
  </View>
);

const styles = StyleSheet.create({
  container: { paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.7 },
  title: { marginTop: 3, fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  cancel: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  field: { paddingTop: 14, paddingBottom: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.3 },
  input: { paddingHorizontal: 0, paddingVertical: 7, fontFamily: fontFamilies.medium, fontSize: fontSizes.body },
  helper: { marginTop: 14, fontFamily: fontFamilies.regular, fontSize: fontSizes.label, lineHeight: 17 },
  save: { height: 54, marginTop: 22, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
});

export default ProfileDetailsSheet;
