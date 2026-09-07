import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../features/auth/providers/AuthProvider';
import { deleteSelfUser } from '../../features/user/services/user.service';
import SlidingBottomModal, { SlidingBottomModalRef } from '../../shared/components/SlidingBottomModal';
import { AppThemeColors } from '../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../shared/constants/typography';
import { usePullToRefresh } from '../../shared/hooks/use-pull-to-refresh.hook';
import { useAppTheme } from '../../shared/providers/AppThemeProvider';
import ImagePickerComponent from './components/ImagePickerComponent';
import ProfileDetailsSheet from './components/ProfileDetailsSheet';
import ProfileNotificationsToggle from './components/ProfileNotificationsToggle';
import ProfileSkeleton from './components/ProfileSkeleton';
import useProfilePageLogic from './hooks/use-profile-page-logic.hook';

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(value, maximum));
const profileQueryNames = ['user'] as const;

const Profile = () => {
  const { data, actions, loadingStates } = useProfilePageLogic();
  const { colors, mode, setMode } = useAppTheme();
  const { logout } = useAuth();
  const { width, height } = useWindowDimensions();
  const { isRefreshing, refresh } = usePullToRefresh(profileQueryNames);
  const pageGutter = clamp(width * 0.055, 18, 26);
  const avatarSize = clamp(width * 0.265, 96, 120);
  const sectionSpacing = clamp(height * 0.038, 26, 38);
  const photoSheet = useRef<SlidingBottomModalRef>(null);
  const detailsSheet = useRef<SlidingBottomModalRef>(null);
  const [pickPhoto, setPickPhoto] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);

  if (loadingStates.isPending) return <ProfileSkeleton />;

  const confirmAccountDeletion = () => {
    Alert.alert('Delete account?', 'Your profile, workout history, and account data will be permanently deleted. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete account',
        style: 'destructive',
        onPress: async () => {
          await deleteSelfUser();
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.canvas }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
        contentContainerStyle={[styles.content, { paddingHorizontal: pageGutter, paddingBottom: clamp(height * 0.05, 32, 48) }]}
      >
        <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>YOUR ACCOUNT</Text>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Profile</Text>

        <View style={[styles.profileHero, { marginTop: clamp(height * 0.03, 22, 32), gap: clamp(width * 0.055, 18, 26) }]}>
          <ImagePickerComponent
            style={{ width: avatarSize, height: avatarSize }}
            openActionSheet={() => photoSheet.current?.open(0)}
            closeActionSheet={() => photoSheet.current?.close()}
            triggerImgPicker={pickPhoto}
            triggerRemoveImg={removePhoto}
            triggerViewImg={viewPhoto}
            userId={data.userId}
            gender={data.gender}
            profilePicPath={data.profilePicPath}
            isUploadingProfilePicture={loadingStates.isUploadingProfilePicture}
            uploadProfilePicture={actions.uploadProfilePicture}
            refreshUser={actions.refreshUser}
            setTriggerImgPicker={setPickPhoto}
            setTriggerRemoveImg={setRemovePhoto}
          />
          <View style={styles.identity}>
            <Text style={[styles.fullName, { color: colors.textPrimary }]} numberOfLines={2}>
              {data.fullName}
            </Text>
            <Text style={[styles.username, { color: colors.textSecondary }]}>@{data.username}</Text>
            {data.gender ? <Text style={[styles.gender, { color: colors.textSecondary }]}>{data.gender}</Text> : null}
            <Pressable hitSlop={10} style={styles.editLink} onPress={() => detailsSheet.current?.open(0)}>
              <Text style={[styles.editLinkText, { color: colors.primary }]}>Edit profile</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {data.memberSince || data.daysOnline ? (
          <View style={[styles.membership, { marginTop: clamp(height * 0.032, 22, 34) }]}>
            {data.memberSince ? <Fact label="MEMBER SINCE" value={data.memberSince} colors={colors} /> : null}
            {data.memberSince && data.daysOnline ? <View style={[styles.verticalRule, { backgroundColor: colors.border }]} /> : null}
            {data.daysOnline ? <Fact label="ONLINE FOR" value={data.daysOnline} colors={colors} /> : null}
          </View>
        ) : null}

        <Divider color={colors.border} spacing={sectionSpacing} />
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ACCOUNT DETAILS</Text>
        <View style={styles.detailsRow}>
          <AccountDetail label="EMAIL" value={data.email} colors={colors} />
          <AccountDetail label="USERNAME" value={`@${data.username}`} colors={colors} />
        </View>
        <View style={styles.detailFooter}>
          <View style={styles.verification}>
            <MaterialCommunityIcons
              name={data.isVerified ? 'check-decagram' : 'clock-outline'}
              size={16}
              color={data.isVerified ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {data.isVerified ? 'Email verified' : 'Verification pending'}
            </Text>
          </View>
          <Pressable hitSlop={10} onPress={() => detailsSheet.current?.open(0)}>
            <Text style={[styles.changeDetails, { color: colors.primary }]}>Change details</Text>
          </Pressable>
        </View>

        <Divider color={colors.border} spacing={sectionSpacing} />
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>APP EXPERIENCE</Text>
        <View style={[styles.controlRow, { borderBottomColor: colors.border }]}>
          <View style={styles.controlCopy}>
            <Text style={[styles.controlTitle, { color: colors.textPrimary }]}>Appearance</Text>
            <Text style={[styles.controlSubtitle, { color: colors.textSecondary }]}>{mode === 'dark' ? 'Dark mode' : 'Light mode'}</Text>
          </View>
          <View style={[styles.themeControl, { backgroundColor: colors.surfaceMuted }]}>
            {(['light', 'dark'] as const).map((themeMode) => (
              <Pressable
                key={themeMode}
                accessibilityLabel={`Use ${themeMode} mode`}
                onPress={() => setMode(themeMode)}
                style={[styles.themeOption, mode === themeMode && { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.themeOptionText, { color: mode === themeMode ? colors.white : colors.textSecondary }]}>
                  {themeMode === 'light' ? 'Light' : 'Dark'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={[styles.controlRow, { borderBottomColor: colors.border }]}>
          <View style={styles.controlCopy}>
            <Text style={[styles.controlTitle, { color: colors.textPrimary }]}>Notifications</Text>
            <Text style={[styles.controlSubtitle, { color: colors.textSecondary }]}>Workout reminders and account updates</Text>
          </View>
          <ProfileNotificationsToggle />
        </View>

        <Pressable accessibilityRole="button" onPress={logout} style={styles.logoutAction}>
          <MaterialCommunityIcons name="logout" size={21} color={colors.textPrimary} />
          <Text style={[styles.logoutText, { color: colors.textPrimary }]}>Log out</Text>
        </Pressable>

        <Divider color={colors.border} spacing={clamp(sectionSpacing * 0.75, 22, 30)} />
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ACCOUNT OWNERSHIP</Text>
        <Text style={[styles.deletionExplanation, { color: colors.textSecondary }]}>
          Permanently remove your account and all associated data.
        </Text>
        <Pressable accessibilityRole="button" hitSlop={10} onPress={confirmAccountDeletion} style={styles.deleteAction}>
          <Text style={styles.deleteText}>Delete account</Text>
        </Pressable>
      </ScrollView>

      <SlidingBottomModal ref={photoSheet} title="Profile photo" snapPoints={['34%', '34%', '34%']} flatListUsage={false}>
        <View style={[styles.photoMenu, { paddingHorizontal: pageGutter }]}>
          <PhotoAction
            icon="image-outline"
            label="View photo"
            color={colors.textPrimary}
            border={colors.border}
            onPress={() => {
              setViewPhoto(false);
              requestAnimationFrame(() => setViewPhoto(true));
            }}
          />
          <PhotoAction
            icon="image-plus"
            label="Choose a new photo"
            color={colors.textPrimary}
            border={colors.border}
            onPress={() => setPickPhoto(true)}
          />
          {data.profilePicPath ? (
            <PhotoAction icon="delete-outline" label="Remove photo" color="#DC2626" onPress={() => setRemovePhoto(true)} />
          ) : null}
        </View>
      </SlidingBottomModal>

      <SlidingBottomModal
        ref={detailsSheet}
        title=""
        snapPoints={['67%', '78%', '88%']}
        flatListUsage={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <ProfileDetailsSheet
          initialData={{ fullName: data.fullName, username: data.username, email: data.email }}
          onClose={() => detailsSheet.current?.close()}
          onFocus={() => detailsSheet.current?.snapToIndex(2)}
          onSave={actions.updateUser}
        />
      </SlidingBottomModal>
    </SafeAreaView>
  );
};

const Fact = ({ label, value, colors }: { label: string; value: string; colors: AppThemeColors }) => (
  <View style={styles.fact}>
    <Text style={[styles.microLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.factValue, { color: colors.textPrimary }]}>{value}</Text>
  </View>
);
const AccountDetail = ({ label, value, colors }: { label: string; value: string; colors: AppThemeColors }) => (
  <View style={styles.detail}>
    <Text style={[styles.microLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: colors.textPrimary }]} numberOfLines={2}>
      {value}
    </Text>
  </View>
);
const Divider = ({ color, spacing }: { color: string; spacing: number }) => (
  <View style={[styles.divider, { backgroundColor: color, marginVertical: spacing }]} />
);
const PhotoAction = ({
  icon,
  label,
  color,
  border,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  color: string;
  border?: string;
  onPress: () => void;
}) => (
  <Pressable
    style={[styles.photoAction, border ? { borderBottomColor: border, borderBottomWidth: StyleSheet.hairlineWidth } : null]}
    onPress={onPress}
  >
    <MaterialCommunityIcons name={icon} size={21} color={color} />
    <Text style={[styles.photoActionText, { color }]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { paddingTop: 12 },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 3 },
  pageTitle: { marginTop: 3, fontFamily: fontFamilies.bold, fontSize: fontSizes.hero },
  profileHero: { flexDirection: 'row', alignItems: 'center' },
  identity: { flex: 1, alignItems: 'flex-start' },
  fullName: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title, lineHeight: 24 },
  username: { marginTop: 4, fontFamily: fontFamilies.regular, fontSize: fontSizes.body },
  gender: { marginTop: 2, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  editLink: { minHeight: 36, marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  editLinkText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  membership: { flexDirection: 'row' },
  fact: { flex: 1 },
  verticalRule: { width: StyleSheet.hairlineWidth, marginHorizontal: 20 },
  microLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.5 },
  factValue: { marginTop: 7, fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  divider: { height: StyleSheet.hairlineWidth },
  sectionLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 2 },
  detailsRow: { marginTop: 21, flexDirection: 'row', gap: 24 },
  detail: { flex: 1, minWidth: 0 },
  detailValue: { marginTop: 7, fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall, lineHeight: 19 },
  detailFooter: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  verification: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  changeDetails: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  controlRow: { minHeight: 80, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, gap: 14 },
  controlCopy: { flex: 1 },
  controlTitle: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body },
  controlSubtitle: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, lineHeight: 18 },
  themeControl: { flexDirection: 'row', borderRadius: 9, overflow: 'hidden' },
  themeOption: { minWidth: 56, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  themeOptionText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  logoutAction: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 13 },
  logoutText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body },
  deletionExplanation: { marginTop: 11, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, lineHeight: 19 },
  deleteAction: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' },
  deleteText: { color: '#DC2626', fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  photoMenu: { paddingBottom: 26 },
  photoAction: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 13 },
  photoActionText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body },
});

export default Profile;
