import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Skeleton } from 'moti/skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const WorkoutPlanSkeleton = () => {
  const { colors: theme, mode } = useAppTheme();
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(14, Math.min(width * 0.045, 22));
  const contentWidth = width - gutter * 2;
  const summaryHeight = Math.max(280, Math.min(height * 0.38, 330));
  const railHeight = Math.max(52, Math.min(height * 0.07, 60));
  const rowHeight = Math.max(72, Math.min(height * 0.096, 84));
  const gap = Math.max(8, Math.min(height * 0.012, 11));

  return (
    <SafeAreaView
      accessibilityLabel="Loading workout plan"
      style={[styles.safeArea, { backgroundColor: theme.canvas }]}
      edges={['top']}
    >
      <ScrollView
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(10, Math.min(height * 0.015, 14)),
          paddingHorizontal: gutter,
          paddingBottom: Math.max(24, Math.min(height * 0.04, 34)),
          gap,
        }}
      >
        <View style={[styles.header, { gap: Math.max(6, height * 0.008) }]}>
          <Skeleton colorMode={mode} width={Math.min(contentWidth * 0.32, 126)} height={fontHeight(height, 10)} radius={5} />
          <Skeleton colorMode={mode} width={Math.min(contentWidth * 0.62, 245)} height={fontHeight(height, 31)} radius={8} />
        </View>

        <Skeleton colorMode={mode} width={contentWidth} height={summaryHeight} radius={Math.max(22, Math.min(width * 0.07, 28))} />
        <Skeleton colorMode={mode} width={contentWidth} height={railHeight} radius={Math.max(14, Math.min(width * 0.045, 18))} />

        <View style={[styles.sectionHeading, { marginTop: Math.max(10, height * 0.014) }]}>
          <Skeleton colorMode={mode} width={Math.min(contentWidth * 0.28, 110)} height={fontHeight(height, 20)} radius={6} />
          <Skeleton colorMode={mode} width={Math.min(contentWidth * 0.14, 54)} height={fontHeight(height, 13)} radius={5} />
        </View>

        {[0, 1, 2, 3].map((index) => (
          <Skeleton
            key={index}
            colorMode={mode}
            width={contentWidth}
            height={rowHeight}
            radius={Math.max(16, Math.min(width * 0.048, 20))}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const fontHeight = (height: number, base: number) => Math.max(base, Math.min(height * (base / 800), base + 3));

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingBottom: 4 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
});

export default WorkoutPlanSkeleton;
