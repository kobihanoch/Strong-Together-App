import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const TrackHistorySkeleton = () => {
  const { colors, mode } = useAppTheme();
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(16, Math.min(width * 0.055, 24));
  const contentWidth = width - gutter * 2;

  return (
    <SafeAreaView accessibilityLabel="Loading workout history" style={[styles.safeArea, { backgroundColor: colors.canvas }]} edges={['top']}>
      <ScrollView scrollEnabled={false} contentContainerStyle={{ paddingHorizontal: gutter, paddingTop: height * 0.015, paddingBottom: 32 }}>
        <View style={styles.header}>
          <View style={styles.heading}>
            <Skeleton colorMode={mode} width={126} height={11} radius={5} />
            <Skeleton colorMode={mode} width={160} height={38} radius={9} />
          </View>
          <Skeleton colorMode={mode} width={48} height={48} radius={14} />
        </View>

        <View style={styles.weekStrip}>
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <Skeleton key={index} colorMode={mode} width={(contentWidth - 48) / 7} height={62} radius={12} />
          ))}
        </View>
        <Skeleton colorMode={mode} width={contentWidth} height={Math.max(150, Math.min(height * 0.2, 180))} radius={20} />
        <View style={styles.sectionTitle}><Skeleton colorMode={mode} width={142} height={18} radius={6} /></View>
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.item}>
            <Skeleton colorMode={mode} width={contentWidth} height={Math.max(70, Math.min(height * 0.09, 82))} radius={16} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { gap: 7 },
  weekStrip: { marginVertical: 22, flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { marginTop: 28, marginBottom: 14 },
  item: { marginBottom: 12 },
});

export default TrackHistorySkeleton;
