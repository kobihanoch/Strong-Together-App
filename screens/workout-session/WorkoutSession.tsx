import type { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootParamList } from '../../navigation/types/appStackTypes';
import { fontFamilies, fontSizes } from '../../shared/constants/typography';
import ElapsedRestControl from './components/ElapsedRestControl';
import SetNavigator from './components/SetNavigator';
import WorkoutMetricEditor from './components/WorkoutMetricEditor';
import WorkoutSessionHeader from './components/WorkoutSessionHeader';
import useWorkoutSessionScreen from './hooks/use-workout-session-screen.hook';
import useToggleStatusBarColor from '../../shared/hooks/use-toggle-status-bar-color.hook';

type Props = StackScreenProps<RootParamList, 'WorkoutSession'>;

const WorkoutSession = ({ route, navigation }: Props) => {
  useToggleStatusBarColor('dark');
  const { data, actions } = useWorkoutSessionScreen(route.params.workoutSplit);
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(12, Math.min(width * 0.035, 16));

  // Navigator and finish flows will be connected in their dedicated slices.
  const noop = (): void => undefined;
  const exitWorkout = (): void => {
    Alert.alert('Exit workout?', 'Your workout draft will be deleted.', [
      { text: 'Keep working', style: 'cancel' },
      {
        text: 'Exit without saving',
        style: 'destructive',
        onPress: async () => {
          navigation.replace('Home');
          await actions.discardWorkout();
        },
      },
    ]);
  };

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
        workoutStartedAtUtc={data.workoutStartedAtUtc}
        previousSet={data.previousSet}
        onBack={exitWorkout}
        onPrevious={actions.previousExercise}
        onNext={actions.nextExercise}
        onOpenNavigator={noop}
        onFinish={noop}
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
          <Pressable accessibilityRole="button" onPress={actions.removeActiveSet} style={styles.removeSet}>
            <Text style={styles.removeSetText}>Remove extra set</Text>
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

          <Pressable disabled={!data.activeSet} onPress={actions.completeSet} style={[styles.done, { opacity: data.activeSet ? 1 : 0.5 }]}>
            <Text style={[styles.doneText, { color: data.theme.primary }]}>✓ Done</Text>
          </Pressable>
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
  removeSet: { alignSelf: 'flex-end', minHeight: 36, justifyContent: 'center', marginRight: 18 },
  removeSetText: { color: '#C33D3D', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
  metrics: { marginTop: 0 },
  done: { minHeight: 44, alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  doneText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  restWrap: { position: 'absolute', bottom: 14 },
});

export default WorkoutSession;
