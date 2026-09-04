import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type Props = { theme: AppThemeColors; startedAt: number; exerciseName: string; onFinish: () => void };

const formatElapsed = (startedAt: number): string => {
  const seconds = Math.floor((Date.now() - startedAt) / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

const ElapsedRestControl = ({ theme, startedAt, exerciseName, onFinish }: Props) => {
  const [elapsed, setElapsed] = useState(() => formatElapsed(startedAt));

  useEffect(() => {
    setElapsed(formatElapsed(startedAt));
    const interval = setInterval(() => setElapsed(formatElapsed(startedAt)), 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <View style={[styles.container, { backgroundColor: theme.heroSurface }]}> 
      <View style={styles.copy}>
        <Text style={styles.label}>REST · {exerciseName}</Text>
        <Text style={styles.time}>{elapsed}</Text>
      </View>
      <Pressable onPress={onFinish} style={[styles.button, { backgroundColor: theme.primary }]}>
        <Text style={styles.buttonText}>Finish Rest</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { minHeight: 68, borderRadius: 20, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
  label: { color: '#B8AEA4', fontFamily: fontFamilies.medium, fontSize: fontSizes.caption },
  time: { color: '#FFFFFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.title, marginTop: 2 },
  button: { minHeight: 40, borderRadius: 13, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
});

export default ElapsedRestControl;
