import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Vibration, View } from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { RFValue } from 'react-native-responsive-fontsize';
import SlidingBottomModal, { SlidingBottomModalRef } from '../../../../shared/components/SlidingBottomModal';
import AnalyzeExerciseSheet from '../components/AnalyzeExerciseSheet';
import ExercisesSection from '../components/ExercisesSection';
import LastWorkoutData from '../components/LastWorkoutData';
import TopBar from '../components/TopBar';
import { showErrorAlert } from '../../../../shared/alerts/error-alerts';
import useStartWorkoutPageLogic from '../hooks/use-start-workout-page-logic.hook';
import { RootParamList } from '../../../../navigation/types/appStackTypes';
import { TrackingMapItem } from '@strong-together/shared';
import { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { ExerciseInPlan } from '@strong-together/shared';

const { width, height } = Dimensions.get('window');

export type ExerciseAnalysisOverview = {
  exerciseId: ExerciseInPlan['id'] | null;
  exerciseName: ExerciseInPlan['exercise'] | null;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  resultCount: number;
};

export type CachedExerciseAnalysis<T> = {
  overview: ExerciseAnalysisOverview;
  result: AnalyzeVideoResultPayload<T> | null;
};

const StartWorkout = ({ route }: StackScreenProps<RootParamList, 'StartWorkout'>) => {
  const {
    data: workoutData,
    saving: workoutSaving,
    controls,
    workoutProgressObj,
    onExit,
  } = useStartWorkoutPageLogic(route.params.workoutSplit, route.params.resumedWorkout);
  const [lastWorkoutDataForModal, setLastWorkoutDataForModal] = useState<{
    lastWorkoutData: TrackingMapItem | null;
    setIndex: number;
  } | null>(null);
  const [selectedExerciseForAnalysis, setSelectedExerciseForAnalysis] = useState<ExerciseInPlan | null>(null);
  // For badge
  const [analysisOverview, setAnalysisOverview] = useState<ExerciseAnalysisOverview>({
    exerciseId: null,
    exerciseName: null,
    status: 'idle',
    resultCount: 0,
  });
  // Save only last analysis (now only suppurts squat)
  const [lastAnalysis, setLastAnalysis] = useState<CachedExerciseAnalysis<SquatRepetition> | null>(null);
  const previousAnalysisStatusRef = useRef<ExerciseAnalysisOverview['status']>('idle');
  const shouldAutoOpenCompletedAnalysisRef = useRef(false);

  // Modals
  const modalRef = useRef<SlidingBottomModalRef | null>(null);
  const analyzeModalRef = useRef<SlidingBottomModalRef | null>(null);
  const openModal = useCallback(() => {
    modalRef?.current?.open?.(0);
  }, []);

  // Open analyze modal callback
  const openAnalyzeModal = useCallback(
    (exercise: ExerciseInPlan) => {
      if (analysisOverview.status === 'processing' && analysisOverview.exerciseId !== exercise.id) {
        showErrorAlert(
          'Analysis in progress',
          `Finish the current ${analysisOverview.exerciseName ?? 'exercise'} analysis before starting another video.`,
        );
        return;
      }

      setSelectedExerciseForAnalysis(exercise);
      analyzeModalRef?.current?.open?.(0);
    },
    [analysisOverview.exerciseId, analysisOverview.exerciseName, analysisOverview.status],
  );

  // Auto open analysis sheet while analysis is done
  useEffect(() => {
    const previousStatus = previousAnalysisStatusRef.current;

    if (analysisOverview.status === 'processing') {
      shouldAutoOpenCompletedAnalysisRef.current = true;
    }

    if (
      previousStatus === 'processing' &&
      analysisOverview.status === 'completed' &&
      analysisOverview.exerciseId &&
      shouldAutoOpenCompletedAnalysisRef.current
    ) {
      const matchingExercise =
        workoutData?.exercisesForSelectedSplit?.find((exercise) => exercise.id === analysisOverview.exerciseId) ?? null;

      if (matchingExercise) {
        Vibration.vibrate([0, 160, 70, 160]);
        setSelectedExerciseForAnalysis(matchingExercise);
        analyzeModalRef.current?.open?.(0);
      }

      shouldAutoOpenCompletedAnalysisRef.current = false;
    }

    if (analysisOverview.status === 'idle') {
      shouldAutoOpenCompletedAnalysisRef.current = false;
    }

    previousAnalysisStatusRef.current = analysisOverview.status;
  }, [analysisOverview, workoutData?.exercisesForSelectedSplit]);

  // Save last analysis in state
  const handleCacheAnalysis = useCallback(
    (
      exerciseId: ExerciseInPlan['id'],
      result: AnalyzeVideoResultPayload<SquatRepetition> | null,
      overview: ExerciseAnalysisOverview,
    ) => {
      setLastAnalysis((prev) => {
        if (
          prev?.result === result &&
          prev?.overview.exerciseId === overview.exerciseId &&
          prev?.overview.exerciseName === overview.exerciseName &&
          prev?.overview.status === overview.status &&
          prev?.overview.resultCount === overview.resultCount
        ) {
          return prev;
        }

        return {
          result,
          overview,
        };
      });
    },
    [],
  );

  const handlePressSave = useCallback(async () => {
    let pressedYes = false;

    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Finish Workout?',
      textBody: 'Are you sure you have completed your workout?',
      button: 'Yes, Finish',
      closeOnOverlayTap: true,
      onPressButton: async () => {
        pressedYes = true;
        Dialog.hide();
        await workoutSaving.saveData();
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
  }, [workoutSaving]);

  const handlePresExit = useCallback(async () => {
    let pressedYes = false;

    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Exit Workout?',
      textBody: 'Are you sure you want to quit the workout? All progress will be lost.',
      button: 'Yes, Exit',
      closeOnOverlayTap: true,
      onPressButton: async () => {
        pressedYes = true;
        Dialog.hide();
        await onExit();
      },
      onHide: () => {
        if (!pressedYes) {
        }
      },
    });
  }, [workoutSaving]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TopBar
          workoutName={workoutData?.workoutName}
          totalSets={workoutData?.totalSets}
          setsDone={workoutData?.setsDone}
          timerProps={{
            startTime: workoutData?.startTime,
            pausedTotal: workoutData?.pausedTotal,
          }}
          saveWorkout={handlePressSave}
          isSaving={workoutSaving?.saveStarted}
          onExit={handlePresExit}
        />
        <ExercisesSection
          exercises={workoutData?.exercisesForSelectedSplit}
          exercisesSetsDoneMap={workoutData?.setsDoneWithExerciseNameKey}
          controls={controls}
          workoutProgressObj={workoutProgressObj}
          setLastWorkoutDataForModal={setLastWorkoutDataForModal}
          openModal={openModal}
          openAnalyzeModal={openAnalyzeModal}
          analysisOverview={analysisOverview}
          lastAnalysis={lastAnalysis}
        />
      </View>

      <SlidingBottomModal
        title="Last Performance"
        ref={modalRef}
        snapPoints={['50%', '60%', '80%']}
        flatListUsage={false}
      >
        <LastWorkoutData lastWorkoutDataForModal={lastWorkoutDataForModal}></LastWorkoutData>
      </SlidingBottomModal>

      <SlidingBottomModal
        title="AI Exercise Analysis"
        ref={analyzeModalRef}
        snapPoints={['80%', '80%', '80%']}
        flatListUsage={false}
      >
        <AnalyzeExerciseSheet
          key={selectedExerciseForAnalysis?.id ?? 'no-exercise-selected'}
          selectedExercise={selectedExerciseForAnalysis}
          analysisOverview={analysisOverview}
          onAnalysisOverviewChange={setAnalysisOverview}
          cachedAnalysis={
            selectedExerciseForAnalysis?.id === lastAnalysis?.overview.exerciseId
              ? (lastAnalysis?.result ?? null)
              : null
          }
          onCacheAnalysis={handleCacheAnalysis}
        />
      </SlidingBottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  countdownContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00142a',
    zIndex: 1,
  },
  countdownText: {
    fontSize: RFValue(80),
    color: 'white',
    fontFamily: 'PoppinsBold',
  },
  exerciseContainer: { width, flex: 1, backgroundColor: 'white' },
  infoContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  exerciseName: {
    fontFamily: 'PoppinsBold',
    fontSize: RFValue(20),
    color: 'white',
    marginTop: height * 0.03,
  },
  exerciseDescription: {
    fontFamily: 'PoppinsRegular',
    fontSize: RFValue(15),
    color: '#8ca7d1',
    marginTop: height * 0.01,
  },
  setContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  setLabel: {
    fontSize: RFValue(25),
    color: '#00142a',
  },
  input: {
    backgroundColor: '#fafafa',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    fontSize: RFValue(18),
    justifyContent: 'center',
    textAlign: 'center',
  },
});

export default StartWorkout;
