import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontFamilies, fontSizes } from '../../shared/constants/typography';
import ExerciseHistoryList from './components/ExerciseHistoryList';
import HistoryWeekStrip from './components/HistoryWeekStrip';
import TrackHistorySummary from './components/TrackHistorySummary';
import useTrackHistory from './hooks/use-track-history.hook';
import CardioHistorySection from './components/CardioHistorySection';
import CardioEntrySheet from '../../features/workouts/cardio/components/CardioEntrySheet';
import { EditableCardioRecord } from '../../features/workouts/cardio/types/cardio.types';

const TrackHistory = () => {
  const { data, actions } = useTrackHistory();
  const { width, height } = useWindowDimensions();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [editingCardio, setEditingCardio] = useState<EditableCardioRecord | null>(null);
  const gutter = Math.max(16, Math.min(width * 0.055, 24));

  if (data.isLoading) {
    return (
      <View style={[styles.loading, { backgroundColor: data.theme.canvas }]}>
        <ActivityIndicator color={data.theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: data.theme.canvas }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: gutter, paddingBottom: height * 0.04 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: height * 0.015 }]}>
          <View>
            <Text style={[styles.eyebrow, { color: data.theme.textSecondary }]}>YOUR PROGRESS</Text>
            <Text style={[styles.title, { color: data.theme.textPrimary }]}>History</Text>
          </View>
          <Pressable onPress={() => setCalendarOpen(true)} style={[styles.calendarButton, { borderColor: data.theme.border }]}>
            <MaterialCommunityIcons name="calendar-month-outline" size={fontSizes.title} color={data.theme.textPrimary} />
          </Pressable>
        </View>
        <HistoryWeekStrip data={data} onSelect={actions.setDate} />
        {data.workout ? <TrackHistorySummary date={data.selectedDate} workout={data.workout} theme={data.theme} /> : null}
        <ExerciseHistoryList data={data} onToggle={actions.toggleExercise} />
        <CardioHistorySection
          records={data.cardioRecords}
          week={data.cardioWeek}
          theme={data.theme}
          isDeleting={data.isCardioDeleting}
          onEdit={setEditingCardio}
          onDelete={actions.deleteCardio}
        />
        {!data.workout && !data.cardioRecords.length ? (
          <Text style={[styles.empty, { color: data.theme.textSecondary }]}>No activity recorded on this day.</Text>
        ) : null}
      </ScrollView>

      <Modal transparent visible={calendarOpen} animationType="fade" onRequestClose={() => setCalendarOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setCalendarOpen(false)}>
          <Pressable style={[styles.calendarModal, { backgroundColor: data.theme.surface }]}>
            <Calendar
              current={data.selectedDate}
              minDate={data.minDate}
              maxDate={data.today}
              onDayPress={(day) => {
                actions.setDate(day.dateString);
                setCalendarOpen(false);
              }}
              markedDates={{ [data.selectedDate]: { selected: true, selectedColor: data.theme.primary } }}
              theme={{
                calendarBackground: data.theme.surface,
                dayTextColor: data.theme.textPrimary,
                monthTextColor: data.theme.textPrimary,
                arrowColor: data.theme.primary,
                todayTextColor: data.theme.primary,
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <CardioEntrySheet
        visible={Boolean(editingCardio)}
        initial={editingCardio}
        saving={data.isCardioEditing}
        theme={data.theme}
        onClose={() => setEditingCardio(null)}
        onSave={async (record) => {
          if (!editingCardio) return;
          await actions.updateCardio(editingCardio.id, record);
          setEditingCardio(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 3 },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.hero, marginTop: 2 },
  calendarButton: { width: 48, height: 48, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', paddingHorizontal: 20 },
  calendarModal: { borderRadius: 20, padding: 8 },
  empty: { fontFamily: fontFamilies.regular, fontSize: fontSizes.body, textAlign: 'center', marginTop: 48 },
});

export default TrackHistory;
