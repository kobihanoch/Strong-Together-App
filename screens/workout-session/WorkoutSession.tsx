import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootParamList } from '../../navigation/types/appStackTypes';
import type { SlidingBottomModalRef } from '../../shared/components/SlidingBottomModal';
import { fontFamilies, fontSizes } from '../../shared/constants/typography';
import useToggleStatusBarColor from '../../shared/hooks/use-toggle-status-bar-color.hook';
import ExerciseLibrarySheet from '../modify-workout/components/ExerciseLibrarySheet';
import ElapsedRestControl from './components/ElapsedRestControl';
import ExerciseNavigatorSheet from './components/ExerciseNavigatorSheet';
import SetNavigator from './components/SetNavigator';
import WorkoutExerciseHistorySheet from './components/WorkoutExerciseHistorySheet';
import WorkoutExerciseProgress from './components/WorkoutExerciseProgress';
import WorkoutMetricEditor from './components/WorkoutMetricEditor';
import WorkoutSessionHeader from './components/WorkoutSessionHeader';
import ExerciseCompletionActions from './components/ExerciseCompletionActions';
import useWorkoutSessionScreen from './hooks/use-workout-session-screen.hook';

type Props = StackScreenProps<RootParamList, 'WorkoutSession'>;

const WorkoutSession = ({ route, navigation }: Props) => {
  const { data, actions } = useWorkoutSessionScreen(route.params.workoutSplit, navigation);
  useToggleStatusBarColor('dark', data.themeMode);
  const { width, height } = useWindowDimensions();
  const navigatorRef = useRef<SlidingBottomModalRef | null>(null);
  const exerciseLibraryRef = useRef<SlidingBottomModalRef | null>(null);
  const historyRef = useRef<SlidingBottomModalRef | null>(null);
  const gutter = Math.max(12, Math.min(width * 0.035, 16));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: data.theme.heroSurface }]} edges={['top']}>
      <WorkoutSessionHeader
        theme={data.theme}
        workoutName={data.workoutName}
        exerciseName={data.exerciseName}
        setNumber={data.setIndex + 1}
        setCount={data.sets.length}
        completedCount={data.completedCount}
        totalSets={data.totalSets}
        plannedCompletedSets={data.plannedProgress.completed}
        plannedTotalSets={data.plannedProgress.total}
        workoutStartedAtUtc={data.workoutStartedAtUtc}
        previousSet={data.previousSet}
        onBack={actions.exitWorkout}
        onPrevious={actions.previousExercise}
        onNext={actions.nextExercise}
        onOpenNavigator={() => navigatorRef.current?.open(1)}
        onFinish={actions.finishWorkout}
        isSaving={data.isSaving}
      />

      <View style={[styles.body, { backgroundColor: data.theme.canvas }]}>
        <View
          style={[
            styles.navigator,
            {
              marginHorizontal: gutter,
              backgroundColor: data.theme.surface,
              borderColor: data.theme.border,
              borderRadius: Math.max(18, Math.min(width * 0.055, 23)),
            },
          ]}
        >
          <SetNavigator
            theme={data.theme}
            sets={data.sets}
            activeIndex={data.setIndex}
            exerciseKey={data.exerciseKey}
            plannedSetCount={data.plannedSetCount}
            completedSetKeys={data.completedSetKeys}
            onSelect={actions.selectSet}
            onAdd={actions.addSet}
          />
        </View>

        {data.isActiveSetExtra && (
          <Pressable accessibilityRole="button" onPress={actions.removeActiveSet} style={styles.removeAction}>
            <MaterialCommunityIcons name="delete-outline" size={16} color="#B93838" />
            <Text style={styles.removeActionText}>Remove extra set</Text>
          </Pressable>
        )}
        {data.isActiveExerciseAdded && (
          <Pressable accessibilityRole="button" onPress={actions.removeActiveExercise} style={styles.removeAction}>
            <MaterialCommunityIcons name="delete-outline" size={16} color="#B93838" />
            <Text style={styles.removeActionText}>Remove added exercise</Text>
          </Pressable>
        )}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingHorizontal: Math.max(20, width * 0.065), paddingBottom: Math.max(90, height * 0.12) },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {data.activeSet && (
            <View style={[styles.metrics, { gap: Math.max(22, Math.min(height * 0.032, 30)) }]}>
              <WorkoutMetricEditor
                theme={data.theme}
                label="WEIGHT (KG)"
                value={data.activeSet.weight}
                step={2.5}
                allowDecimal
                onChange={actions.updateWeight}
              />
              <WorkoutMetricEditor theme={data.theme} label="REPS" value={data.activeSet.reps} onChange={actions.updateReps} />
            </View>
          )}

          {data.isActiveExerciseComplete ? (
            <ExerciseCompletionActions
              theme={data.theme}
              workoutComplete={data.isPlannedWorkoutComplete}
              canAddExtraSet={!data.isActiveExerciseAdded}
              onNext={actions.selectNextIncompleteExercise}
              onFinish={actions.finishWorkout}
              onAddSet={actions.addSet}
            />
          ) : (
            <View style={styles.completionRow}>
              <Text style={[styles.completionHint, { color: data.theme.textSecondary }]}>CHANGES SAVE AUTOMATICALLY</Text>
              <Pressable
                disabled={!data.canCompleteActiveSet}
                onPress={actions.completeSet}
                style={({ pressed }) => [
                  styles.done,
                  {
                    backgroundColor: data.canCompleteActiveSet ? data.theme.primary : data.theme.primarySoft,
                    opacity: data.canCompleteActiveSet ? (pressed ? 0.82 : 1) : 0.55,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                  },
                ]}
              >
                <Text style={[styles.doneText, { color: data.canCompleteActiveSet ? data.theme.white : data.theme.primary }]}>
                  ✓ {data.isActiveSetCompleted ? 'Set completed' : 'Mark set complete'}
                </Text>
              </Pressable>
            </View>
          )}

          <WorkoutExerciseProgress theme={data.theme} points={data.historyPoints} onViewAll={() => historyRef.current?.open(1)} />
        </ScrollView>
      </View>

      {data.rest && (
        <View style={[styles.restWrap, { left: gutter, right: gutter }]}>
          <ElapsedRestControl
            theme={data.theme}
            startedAt={new Date(data.rest.startedAtUtc).getTime()}
            exerciseName={data.rest.exerciseName}
            onFinish={actions.finishRest}
          />
        </View>
      )}

      <ExerciseNavigatorSheet
        modalRef={navigatorRef}
        theme={data.theme}
        exercises={data.navigatorExercises}
        activeIndex={data.exerciseIndex}
        onSelect={actions.selectExercise}
        onReorder={actions.reorderExercises}
        onAddExercise={() => {
          navigatorRef.current?.close();
          setTimeout(() => exerciseLibraryRef.current?.open(1), 220);
        }}
      />

      <ExerciseLibrarySheet
        modalRef={exerciseLibraryRef}
        height={height}
        contextName={data.workoutName}
        exerciseCount={data.navigatorExercises.length}
        exercises={data.exercisePicker.exercises}
        isLoading={data.exercisePicker.isLoading}
        muscles={data.exercisePicker.muscles}
        selectedMuscle={data.exercisePicker.selectedMuscle}
        query={data.exercisePicker.query}
        theme={data.theme}
        themeMode={data.themeMode}
        onQuery={actions.setExerciseQuery}
        onMuscle={actions.setSelectedMuscle}
        onAdd={actions.addExercise}
        isExerciseAdded={data.exercisePicker.isAdded}
      />

      <WorkoutExerciseHistorySheet
        modalRef={historyRef}
        theme={data.theme}
        exerciseName={data.exerciseName}
        history={data.exerciseHistory}
        points={data.historyPoints}
        plannedSetCount={data.plannedSetCount}
        onFillValues={actions.fillFromHistory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  body: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingTop: 15 },
  navigator: {
    marginTop: -29,
    height: 58,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  removeAction: {
    alignSelf: 'center',
    minHeight: 36,
    marginTop: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  removeActionText: { color: '#B93838', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
  metrics: { marginTop: 0 },
  completionRow: { marginTop: 18, gap: 9 },
  completionHint: { textAlign: 'center', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.1 },
  done: {
    minHeight: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  doneText: { fontFamily: fontFamilies.bold, fontSize: fontSizes.bodySmall, letterSpacing: 0.1 },
  restWrap: { position: 'absolute', bottom: 14 },
});

export default WorkoutSession;
