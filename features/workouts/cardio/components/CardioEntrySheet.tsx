import React, { useEffect, useRef, useState } from 'react';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import SlidingBottomModal, { SlidingBottomModalRef } from '../../../../shared/components/SlidingBottomModal';
import { AppThemeColors } from '../../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import { CardioEntryInput } from '../types/cardio.types';

type Props = {
  visible: boolean;
  initial?: CardioEntryInput | null;
  saving: boolean;
  theme: AppThemeColors;
  onClose: () => void;
  onSave: (entry: CardioEntryInput) => Promise<void>;
};

const CardioEntrySheet = ({ visible, initial, saving, theme, onClose, onSave }: Props) => {
  const sheetRef = useRef<SlidingBottomModalRef>(null);
  const [type, setType] = useState('Walk');
  const [minutes, setMinutes] = useState('30');

  // Keep the imperative sheet synchronized with the screen's simple visible state.
  useEffect(() => {
    if (visible) {
      setType(initial?.type ?? 'Walk');
      setMinutes(String(initial?.durationMins ?? 30));
      sheetRef.current?.open(0);
    } else {
      sheetRef.current?.close();
    }
  }, [initial, visible]);

  const durationMins = Math.max(1, Number.parseInt(minutes, 10) || 0);

  return (
    <SlidingBottomModal
      ref={sheetRef}
      title={initial ? 'Edit cardio' : 'Log cardio'}
      snapPoints={['48%']}
      flatListUsage={false}
      onChange={(index) => {
        if (index === -1 && visible) onClose();
      }}
    >
      <View style={styles.content}>
        <View style={styles.types}>
          {['Walk', 'Run'].map((option) => (
            <Pressable
              key={option}
              onPress={() => setType(option)}
              style={[
                styles.type,
                {
                  borderColor: type === option ? theme.primary : theme.border,
                  backgroundColor: type === option ? theme.primarySoft : theme.surface,
                },
              ]}
            >
              <Text style={[styles.typeText, { color: type === option ? theme.primary : theme.textSecondary }]}>{option}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.label, { color: theme.textSecondary }]}>DURATION</Text>
        <View style={[styles.duration, { borderBottomColor: theme.border }]}>
          <BottomSheetTextInput
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="number-pad"
            maxLength={3}
            style={[styles.input, { color: theme.textPrimary }]}
          />
          <Text style={[styles.unit, { color: theme.textSecondary }]}>minutes</Text>
        </View>
        <Pressable
          disabled={saving}
          onPress={() => onSave({ type, durationMins, durationSec: 0 })}
          style={[styles.save, { backgroundColor: theme.primary, opacity: saving ? 0.6 : 1 }]}
        >
          {saving ? <ActivityIndicator color={theme.white} /> : <Text style={styles.saveText}>{initial ? 'Save changes' : 'Save cardio'}</Text>}
        </Pressable>
      </View>
    </SlidingBottomModal>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, paddingBottom: 36 },
  types: { flexDirection: 'row', gap: 10, marginTop: 8 },
  type: { flex: 1, height: 46, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  typeText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  label: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.5, marginTop: 24 },
  duration: { flexDirection: 'row', alignItems: 'baseline', borderBottomWidth: 1, paddingVertical: 8 },
  input: { fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, minWidth: 64, padding: 0 },
  unit: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  save: { height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  saveText: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
});

export default CardioEntrySheet;
