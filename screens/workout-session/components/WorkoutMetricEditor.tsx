import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type Props = {
  theme: AppThemeColors;
  label: string;
  value: number;
  step?: number;
  allowDecimal?: boolean;
  onChange: (value: number) => void;
};

const WorkoutMetricEditor = ({ theme, label, value, step = 1, allowDecimal = false, onChange }: Props) => {
  const { width, height } = useWindowDimensions();
  const [input, setInput] = useState(String(value));
  const controlSize = Math.max(52, Math.min(width * 0.15, 62));
  const unit = label.match(/\(([^)]+)\)/)?.[1];
  const metricName = label.replace(/\s*\([^)]+\)/, '');

  useEffect(() => setInput(String(value)), [value]);

  const updateInput = (text: string): void => {
    const next = allowDecimal ? text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') : text.replace(/\D/g, '');
    setInput(next);

    // Keep a trailing decimal visible while the user types, then persist once it is numeric.
    if (next && next !== '.' && !next.endsWith('.')) onChange(Number(next));
    if (!next) onChange(0);
  };

  const stepValue = (nextValue: number): void => {
    const normalized = Math.max(0, nextValue);
    setInput(String(normalized));
    onChange(normalized);
  };

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>{metricName}</Text>
        {unit && <Text style={[styles.unit, { color: theme.textSecondary }]}>{unit}</Text>}
      </View>
      <View style={[styles.editor, { minHeight: Math.max(88, Math.min(height * 0.12, 108)) }]}> 
        <Pressable
          accessibilityLabel={`Decrease ${label}`}
          onPress={() => stepValue(value - step)}
          style={({ pressed }) => [
            styles.button,
            { width: controlSize, height: controlSize, borderColor: theme.border },
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons name="minus" size={24} color={theme.textSecondary} />
        </Pressable>
        <TextInput
          value={input}
          onChangeText={updateInput}
          onBlur={() => setInput(String(value))}
          keyboardType={allowDecimal ? 'decimal-pad' : 'number-pad'}
          selectTextOnFocus
          style={[styles.value, { color: theme.textPrimary }]}
        />
        <Pressable
          accessibilityLabel={`Increase ${label}`}
          onPress={() => stepValue(value + step)}
          style={({ pressed }) => [
            styles.button,
            { width: controlSize, height: controlSize, borderColor: theme.border },
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons name="plus" size={24} color={theme.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: { marginBottom: 6, flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  label: { fontFamily: fontFamilies.bold, fontSize: fontSizes.bodySmall, letterSpacing: 0.8 },
  unit: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 1 },
  editor: { flexDirection: 'row', alignItems: 'center' },
  button: { borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.65, transform: [{ scale: 0.94 }] },
  value: { flex: 1, textAlign: 'center', fontFamily: fontFamilies.bold, fontSize: fontSizes.hero + 22, letterSpacing: -1.8, paddingVertical: 0 },
});

export default WorkoutMetricEditor;
