import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const ProfileSkeleton = () => {
  const { colors, mode } = useAppTheme();
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(18, Math.min(width * 0.055, 26));
  const contentWidth = width - gutter * 2;
  const avatarSize = Math.max(96, Math.min(width * 0.265, 120));

  return (
    <SafeAreaView accessibilityLabel="Loading profile" style={[styles.safeArea, { backgroundColor: colors.canvas }]} edges={['top']}>
      <ScrollView scrollEnabled={false} contentContainerStyle={[styles.content, { paddingHorizontal: gutter }]}>
        <Skeleton colorMode={mode} width={118} height={11} radius={5} />
        <View style={styles.title}><Skeleton colorMode={mode} width={170} height={38} radius={9} /></View>

        <View style={[styles.hero, { marginTop: Math.max(22, Math.min(height * 0.03, 32)) }]}>
          <Skeleton colorMode={mode} width={avatarSize} height={avatarSize} radius={avatarSize / 2} />
          <View style={styles.identity}>
            <Skeleton colorMode={mode} width={Math.min(contentWidth * 0.46, 180)} height={22} radius={7} />
            <Skeleton colorMode={mode} width={Math.min(contentWidth * 0.31, 120)} height={15} radius={6} />
            <Skeleton colorMode={mode} width={86} height={15} radius={6} />
          </View>
        </View>

        <View style={styles.facts}>
          <Skeleton colorMode={mode} width={contentWidth * 0.42} height={48} radius={8} />
          <Skeleton colorMode={mode} width={contentWidth * 0.42} height={48} radius={8} />
        </View>
        <View style={[styles.rule, { backgroundColor: colors.border }]} />
        <Skeleton colorMode={mode} width={132} height={11} radius={5} />
        <View style={styles.details}>
          <Skeleton colorMode={mode} width={contentWidth * 0.43} height={54} radius={8} />
          <Skeleton colorMode={mode} width={contentWidth * 0.43} height={54} radius={8} />
        </View>
        <View style={[styles.rule, { backgroundColor: colors.border }]} />
        <Skeleton colorMode={mode} width={126} height={11} radius={5} />
        {[0, 1, 2].map((index) => (
          <View key={index} style={[styles.row, { borderBottomColor: colors.border }]}>
            <Skeleton colorMode={mode} width={contentWidth * 0.55} height={18} radius={6} />
            <Skeleton colorMode={mode} width={52} height={32} radius={9} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { paddingTop: 14, paddingBottom: 36 },
  title: { marginTop: 8 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 22 },
  identity: { flex: 1, gap: 10 },
  facts: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
  rule: { height: StyleSheet.hairlineWidth, marginVertical: 30 },
  details: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
  row: { minHeight: 76, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export default ProfileSkeleton;
