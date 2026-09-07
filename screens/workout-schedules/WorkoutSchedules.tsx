import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SlidingBottomModal from '../../shared/components/SlidingBottomModal';
import { fontFamilies, fontSizes } from '../../shared/constants/typography';
import useWorkoutScheduleScreen from './hooks/use-workout-schedule-screen.hook';

const WorkoutSchedules = () => {
  const { refs, data, loadingStates, actions } = useWorkoutScheduleScreen();

  if (loadingStates.isPending)
    return (
      <SafeAreaView style={[styles.loading, { backgroundColor: data.theme.canvas }]}>
        <ActivityIndicator color={data.theme.primary} />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: data.theme.canvas }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={actions.goBack} style={styles.back}>
          <MaterialCommunityIcons name="arrow-left" size={28} color={data.theme.textPrimary} />
        </Pressable>
        <Text style={[styles.eyebrow, { color: data.theme.textSecondary }]}>YOUR TRAINING</Text>
        <Text style={[styles.title, { color: data.theme.textPrimary }]}>Plan your week</Text>
        <Text style={[styles.subtitle, { color: data.theme.textSecondary }]}>Build a rhythm that repeats every week.</Text>

        <View style={styles.weekStrip}>
          {data.weekDays.map((day) => (
            <View key={day.short} style={styles.weekDay}>
              <Text style={[styles.weekLetter, { color: data.theme.textPrimary }]}>{day.letter}</Text>
              {day.schedule ? (
                <MaterialCommunityIcons name="dumbbell" size={18} color={data.theme.primary} />
              ) : (
                <View style={[styles.restDash, { backgroundColor: data.theme.border }]} />
              )}
            </View>
          ))}
        </View>
        <Text style={[styles.summary, { color: data.theme.textSecondary }]}>
          {data.trainingDays} training days · {data.restDays} rest days
        </Text>

        <Text style={[styles.section, { color: data.theme.textSecondary }]}>WEEKLY SCHEDULE</Text>
        {data.weekDays.map((day) => (
          <Pressable
            key={day.short}
            onPress={() => actions.openDay(day.dayOfWeek)}
            style={[styles.row, { borderBottomColor: data.theme.border }]}
          >
            <Text style={[styles.day, { color: day.schedule ? data.theme.textPrimary : data.theme.textSecondary }]}>{day.short}</Text>
            {day.schedule && <View style={[styles.line, { backgroundColor: data.theme.primary }]} />}
            <View style={styles.rowCopy}>
              <Text style={[styles.workout, { color: day.schedule ? data.theme.textPrimary : data.theme.textSecondary }]}>
                {day.workoutName}
              </Text>
              <View style={styles.meta}>
                {day.schedule && <MaterialCommunityIcons name="clock-outline" size={17} color={data.theme.textSecondary} />}
                <Text style={[styles.metaText, { color: data.theme.textSecondary }]}>
                  {day.schedule ? day.schedule.startTime.slice(0, 5) : 'No workout'}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={27} color={data.theme.textSecondary} />
          </Pressable>
        ))}

        <View style={[styles.reminders, { borderTopColor: data.theme.border }]}>
          <Text style={[styles.section, styles.reminderTitle, { color: data.theme.textSecondary }]}>WORKOUT REMINDERS</Text>
          <View style={styles.reminderRow}>
            <MaterialCommunityIcons name="bell-outline" size={28} color={data.theme.textSecondary} />
            <View style={styles.reminderCopy}>
              <Text style={[styles.reminderName, { color: data.theme.textPrimary }]}>Reminders</Text>
              <Text style={[styles.metaText, { color: data.theme.textSecondary }]}>{data.reminderLabel}</Text>
              {!data.hasNotificationsPermission && (
                <Text style={[styles.permission, { color: data.theme.textSecondary }]}>Enable notifications in Settings</Text>
              )}
            </View>
            <View style={styles.reminderActions}>
              <Switch
                value={data.reminderEnabled}
                disabled={!data.hasNotificationsPermission}
                onValueChange={actions.toggleReminder}
                trackColor={{ false: data.theme.surfaceMuted, true: data.theme.primary }}
              />
            </View>
          </View>
        </View>

        <Pressable
          disabled={loadingStates.isSaving || data.trainingDays === 0}
          onPress={actions.save}
          style={({ pressed }) => [
            styles.save,
            { backgroundColor: data.theme.primary, opacity: pressed || data.trainingDays === 0 ? 0.55 : 1 },
          ]}
        >
          {loadingStates.isSaving ? (
            <ActivityIndicator color={data.theme.white} />
          ) : (
            <Text style={[styles.saveText, { color: data.theme.white }]}>Save schedule</Text>
          )}
        </Pressable>
      </ScrollView>

      <SlidingBottomModal
        ref={refs.dayEditorRef}
        title=""
        snapPoints={['52%', '76%']}
        flatListUsage={false}
        onChange={actions.handleDaySheetChange}
      >
        <View style={styles.editor}>
          <View style={styles.editorHeader}>
            <View>
              <Text style={[styles.editorDay, { color: data.theme.textSecondary }]}>{data.editingDayLabel}</Text>
              <Text style={[styles.editorTitle, { color: data.theme.textPrimary }]}>Choose workout</Text>
            </View>
            <Pressable disabled={!data.isTimeValid} onPress={actions.doneEditing} hitSlop={10}>
              <Text style={[styles.done, { color: data.isTimeValid ? data.theme.primary : data.theme.textSecondary }]}>Done</Text>
            </Pressable>
          </View>
          <Pressable style={[styles.option, { borderBottomColor: data.theme.border }]} onPress={() => actions.selectWorkout(null)}>
            <Text style={[styles.optionText, { color: data.theme.textSecondary }]}>Rest day</Text>
            {!data.editingSchedule && <MaterialCommunityIcons name="check" size={22} color={data.theme.primary} />}
          </Pressable>
          {data.workoutSplits.map((split) => (
            <Pressable
              key={split.id}
              style={[styles.option, { borderBottomColor: data.theme.border }]}
              onPress={() => actions.selectWorkout(split.id)}
            >
              <Text style={[styles.optionText, { color: data.theme.textPrimary }]}>{split.name}</Text>
              {data.editingSchedule?.workoutSplitId === split.id && (
                <MaterialCommunityIcons name="check" size={22} color={data.theme.primary} />
              )}
            </Pressable>
          ))}
          {data.editingSchedule && (
            <View style={styles.timeRow}>
              <Text style={[styles.optionText, { color: data.theme.textPrimary }]}>Workout time</Text>
              <TextInput
                value={data.timeDraft}
                onFocus={actions.startTimeEdit}
                onChangeText={actions.setTimeDraft}
                placeholder="18:00"
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                style={[styles.timeInput, { color: data.theme.textPrimary, borderColor: data.isTimeValid ? data.theme.border : '#DC2626' }]}
              />
            </View>
          )}
        </View>
      </SlidingBottomModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 22 },
  back: { alignSelf: 'flex-start', marginBottom: 32 },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 1.4 },
  title: { marginTop: 5, fontFamily: fontFamilies.bold, fontSize: fontSizes.hero },
  subtitle: { marginTop: 8, fontFamily: fontFamilies.regular, fontSize: fontSizes.body },
  weekStrip: { marginTop: 28, flexDirection: 'row', justifyContent: 'space-between' },
  weekDay: { width: 30, height: 48, alignItems: 'center', justifyContent: 'space-between' },
  weekLetter: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  restDash: { width: 16, height: 2, borderRadius: 1, marginBottom: 8 },
  summary: { marginTop: 12, textAlign: 'center', fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  section: { marginTop: 32, marginBottom: 9, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 1.2 },
  row: { minHeight: 72, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth },
  day: { width: 54, fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  line: { width: 2, height: 38, marginRight: 18 },
  rowCopy: { flex: 1 },
  workout: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  meta: { marginTop: 3, flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  reminders: { marginTop: 25, borderTopWidth: StyleSheet.hairlineWidth },
  reminderTitle: { marginTop: 25 },
  reminderRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 14 },
  reminderCopy: { flex: 1 },
  reminderName: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body, marginBottom: 3 },
  permission: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  reminderActions: { alignItems: 'center', gap: 2 },
  change: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  save: { height: 58, marginTop: 27, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  saveText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  editor: { paddingHorizontal: 22, paddingBottom: 32 },
  editorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  editorDay: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.2 },
  editorTitle: { marginTop: 3, fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  done: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  option: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body },
  timeRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeInput: {
    width: 82,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.body,
  },
});

export default WorkoutSchedules;
