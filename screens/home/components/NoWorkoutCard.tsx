import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Column from '../../../shared/components/Column';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';

type Props = { theme: AppThemeColors; onCreate: () => void };

const NoWorkoutCard = ({ theme, onCreate }: Props) => {
  const { width, height } = useWindowDimensions();
  const common = createSharedComponentStyles(theme);
  const styles = createStyles(width, height);

  return (
    <Column style={[styles.container, { backgroundColor: theme.heroSurface }]}>
      <View style={styles.illustrationArea}>
        <View style={[styles.orbitOuter, { borderColor: theme.border }]}>
          <View style={[styles.orbitInner, { borderColor: theme.border }]}>
            <View style={[styles.iconCore, { backgroundColor: theme.primarySoft }]}>
              <MaterialCommunityIcons name="dumbbell" size={fontSizes.hero} color={theme.primary} />
            </View>
          </View>
          <View style={[styles.floatingBadge, styles.addBadge, { backgroundColor: theme.surface }]}>
            <MaterialCommunityIcons name="plus" size={fontSizes.bodySmall} color={theme.primary} />
          </View>
          <View style={[styles.floatingBadge, styles.readyBadge, { backgroundColor: theme.surface }]}>
            <MaterialCommunityIcons name="check" size={fontSizes.bodySmall} color={theme.profit} />
          </View>
        </View>

        <View style={[styles.planPreview, { borderColor: theme.border }]}>
          <PreviewStep theme={theme} index="01" icon="format-list-bulleted" label="Choose exercises" />
          <View style={[styles.previewConnector, { backgroundColor: theme.border }]} />
          <PreviewStep theme={theme} index="02" icon="counter" label="Set reps" />
          <View style={[styles.previewConnector, { backgroundColor: theme.border }]} />
          <PreviewStep theme={theme} index="03" icon="play-outline" label="Start training" />
        </View>
      </View>

      <View style={styles.copyBlock}>
        <Text style={[styles.eyebrow, { color: theme.primary }]}>BUILD YOUR ROUTINE</Text>
        <Text style={[styles.title, { color: theme.white }]}>Create your first workout</Text>
        <Text style={[styles.copy, { color: theme.white }]}>
          Add your exercises, sets, and reps once. We’ll keep your next workout ready here.
        </Text>
        <TouchableOpacity style={[common.primaryButton, styles.button]} onPress={onCreate} activeOpacity={0.85}>
          <Text style={common.primaryButtonText}>Create workout</Text>
          <MaterialCommunityIcons name="arrow-right" size={fontSizes.title} color={theme.white} />
        </TouchableOpacity>
      </View>
    </Column>
  );
};

const PreviewStep = ({
  theme,
  index,
  icon,
  label,
}: {
  theme: AppThemeColors;
  index: string;
  icon: 'format-list-bulleted' | 'counter' | 'play-outline';
  label: string;
}) => (
  <View style={stepStyles.container}>
    <View style={[stepStyles.icon, { backgroundColor: theme.primarySoft }]}>
      <MaterialCommunityIcons name={icon} size={fontSizes.bodySmall} color={theme.primary} />
    </View>
    <View style={stepStyles.copy}>
      <Text style={[stepStyles.index, { color: theme.white }]}>{index}</Text>
      <Text numberOfLines={1} style={[stepStyles.label, { color: theme.white }]}>{label}</Text>
    </View>
  </View>
);

const stepStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  icon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  copy: { marginTop: 6, alignItems: 'center' },
  index: { opacity: 0.48, fontFamily: fontFamilies.medium, fontSize: fontSizes.caption },
  label: { marginTop: 2, opacity: 0.76, fontFamily: fontFamilies.medium, fontSize: fontSizes.caption },
});

const createStyles = (width: number, height: number) => {
  const padding = Math.max(20, Math.min(width * 0.06, 28));
  const artworkSize = Math.max(132, Math.min(width * 0.42, height * 0.22, 180));
  const previewGap = Math.max(7, Math.min(width * 0.025, 12));

  return StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between', padding, borderRadius: Math.max(20, Math.min(width * 0.055, 24)) },
    illustrationArea: { flex: 1, minHeight: Math.max(230, height * 0.32), alignItems: 'center', justifyContent: 'center' },
    orbitOuter: { width: artworkSize, height: artworkSize, borderRadius: artworkSize / 2, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    orbitInner: { width: artworkSize * 0.72, height: artworkSize * 0.72, borderRadius: artworkSize * 0.36, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    iconCore: { width: artworkSize * 0.48, height: artworkSize * 0.48, borderRadius: artworkSize * 0.24, alignItems: 'center', justifyContent: 'center' },
    floatingBadge: { position: 'absolute', width: Math.max(30, artworkSize * 0.22), height: Math.max(30, artworkSize * 0.22), borderRadius: artworkSize * 0.12, alignItems: 'center', justifyContent: 'center' },
    addBadge: { top: artworkSize * 0.05, right: artworkSize * 0.06 },
    readyBadge: { left: artworkSize * 0.02, bottom: artworkSize * 0.12 },
    planPreview: { width: '100%', marginTop: Math.max(18, height * 0.025), paddingHorizontal: Math.max(10, width * 0.03), paddingVertical: Math.max(12, height * 0.016), borderWidth: 1, borderRadius: Math.max(14, width * 0.04), flexDirection: 'row', alignItems: 'flex-start', gap: previewGap },
    previewConnector: { flex: 0.28, height: StyleSheet.hairlineWidth, marginTop: 15 },
    copyBlock: { paddingTop: Math.max(18, height * 0.025) },
    eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 0.7 },
    title: { marginTop: Math.max(6, height * 0.009), fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
    copy: { marginTop: Math.max(8, height * 0.012), opacity: 0.72, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, lineHeight: fontSizes.title },
    button: { marginTop: Math.max(18, height * 0.024) },
  });
};

export default NoWorkoutCard;
