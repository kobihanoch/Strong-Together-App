import { ReplaceWorkoutSchedulesBody } from '@strong-together/shared';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReminder } from '../../../features/reminder/hooks/use-reminder.hook';
import { useWorkoutSchedule } from '../../../features/workout-schedule/hooks/use-workout-schedule.hook';
import { useWorkoutPlan } from '../../../features/workouts/plan/hooks/use-workout-plan.hook';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import type { SlidingBottomModalRef } from '../../../shared/components/SlidingBottomModal';
import { useNotificationPermission } from '../../../shared/hooks/use-notification-permission.hook';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import { getTimeZoneFromStore } from '../../../shared/stores/time-zone.store';

export type ScheduleItem = ReplaceWorkoutSchedulesBody['schedules'][number];

export const WEEK_DAYS = [
  { dayOfWeek: 0, short: 'SUN', letter: 'S' },
  { dayOfWeek: 1, short: 'MON', letter: 'M' },
  { dayOfWeek: 2, short: 'TUE', letter: 'T' },
  { dayOfWeek: 3, short: 'WED', letter: 'W' },
  { dayOfWeek: 4, short: 'THU', letter: 'T' },
  { dayOfWeek: 5, short: 'FRI', letter: 'F' },
  { dayOfWeek: 6, short: 'SAT', letter: 'S' },
] as const;

const isValidTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
const getOffsetLabel = (minutes: number) =>
  minutes === 60 ? '1 hour before' : minutes === 1440 ? '1 day before' : `${minutes} minutes before`;

const useWorkoutScheduleScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const { data: planData } = useWorkoutPlan();
  const { data: scheduleData, loadingStates, actions: scheduleActions } = useWorkoutSchedule();
  const { isEnabled: hasNotificationsPermission, status: notificationsPermissionStatus } = useNotificationPermission();
  const { data: reminderData, loadingStates: reminderLoading, actions: reminderActions } = useReminder(hasNotificationsPermission);
  const dayEditorRef = useRef<SlidingBottomModalRef | null>(null);
  const initialized = useRef(false);
  const reminderInitialized = useRef(false);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [timeDraft, setTimeDraft] = useState('18:00');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderOffsetMinutes, setReminderOffsetMinutes] = useState(30);

  useEffect(() => {
    if (!scheduleData.workoutSchedules || initialized.current) return;
    setSchedules(scheduleData.workoutSchedules.schedules);
    initialized.current = true;
  }, [scheduleData.workoutSchedules]);

  useEffect(() => {
    if (!hasNotificationsPermission) setReminderEnabled(false);
  }, [hasNotificationsPermission]);

  useEffect(() => {
    if (reminderLoading.isPending || notificationsPermissionStatus === null || reminderInitialized.current) return;
    setReminderEnabled(Boolean(reminderData.reminder?.reminderEnabled && hasNotificationsPermission));
    setReminderOffsetMinutes(reminderData.reminder?.reminderOffsetMinutes ?? 30);
    reminderInitialized.current = true;
  }, [hasNotificationsPermission, notificationsPermissionStatus, reminderData.reminder, reminderLoading.isPending]);

  const scheduleByDay = useMemo(
    () => new Map(schedules.map((schedule) => [schedule.dayOfWeek, schedule])),
    [schedules],
  );

  const weekDays = useMemo(
    () =>
      WEEK_DAYS.map((day) => {
        const schedule = scheduleByDay.get(day.dayOfWeek);
        const split = planData.workoutSplits.find((item) => item.id === schedule?.workoutSplitId);
        return { ...day, schedule, workoutName: split?.name ?? 'Rest day' };
      }),
    [planData.workoutSplits, scheduleByDay],
  );

  const editingSchedule = editingDay === null ? undefined : scheduleByDay.get(editingDay);
  const trainingDays = schedules.length;

  const openDay = (dayOfWeek: number) => {
    setEditingDay(dayOfWeek);
    setTimeDraft(scheduleByDay.get(dayOfWeek)?.startTime.slice(0, 5) ?? '18:00');
    dayEditorRef.current?.open(0);
  };

  const closeDay = () => {
    dayEditorRef.current?.close();
    setEditingDay(null);
  };

  const handleDaySheetChange = (index: number) => {
    if (index === -1) setEditingDay(null);
  };

  const selectWorkout = (workoutSplitId: number | null) => {
    if (editingDay === null) return;
    setSchedules((current) => {
      const rest = current.filter((item) => item.dayOfWeek !== editingDay);
      return workoutSplitId === null ? rest : [...rest, { dayOfWeek: editingDay, workoutSplitId, startTime: timeDraft }];
    });
  };

  const startTimeEdit = () => dayEditorRef.current?.snapToIndex(1);

  const doneEditing = () => {
    if (editingDay === null) return;
    if (editingSchedule && !isValidTime(timeDraft)) return;
    if (editingSchedule) {
      setSchedules((current) =>
        current.map((item) => (item.dayOfWeek === editingDay ? { ...item, startTime: timeDraft } : item)),
      );
    }
    closeDay();
  };

  const toggleReminder = (enabled: boolean) => {
    if (enabled && !hasNotificationsPermission) return;
    setReminderEnabled(enabled);
  };

  const save = async () => {
    await scheduleActions.updateWorkoutSchedules(schedules);
    await reminderActions.updateReminder({ reminderEnabled, reminderOffsetMinutes, timeZone: getTimeZoneFromStore() });
    navigation.goBack();
  };

  return {
    refs: { dayEditorRef },
    data: {
      theme,
      workoutSplits: planData.workoutSplits,
      weekDays,
      editingSchedule,
      editingDayLabel: WEEK_DAYS.find((day) => day.dayOfWeek === editingDay)?.short ?? '',
      timeDraft,
      isTimeValid: isValidTime(timeDraft),
      trainingDays,
      restDays: 7 - trainingDays,
      reminderEnabled,
      reminderLabel: `${getOffsetLabel(reminderOffsetMinutes)} timed workouts`,
      hasNotificationsPermission,
    },
    loadingStates: {
      isPending: loadingStates.isPending || reminderLoading.isPending,
      isSaving: loadingStates.isUpdating || reminderLoading.isUpdating,
    },
    actions: {
      goBack: navigation.goBack,
      openDay,
      closeDay,
      handleDaySheetChange,
      selectWorkout,
      startTimeEdit,
      setTimeDraft,
      doneEditing,
      toggleReminder,
      save,
    },
  };
};

export default useWorkoutScheduleScreen;
