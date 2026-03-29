import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, Vibration } from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { RFValue } from 'react-native-responsive-fontsize';
import SlidingBottomModal, { SlidingBottomModalRef } from '../components/SlidingBottomModal';
import AnalyzeExerciseSheet from '../components/StartWorkoutComponents/AnalyzeExerciseSheet';
import ExercisesSection from '../components/StartWorkoutComponents/ExercisesSection';
import LastWorkoutData from '../components/StartWorkoutComponents/LastWorkoutData';
import TopBar from '../components/StartWorkoutComponents/TopBar';
import { showErrorAlert } from '../errors/errorAlerts';
import useStartWorkoutPageLogic from '../hooks/logic/useStartWorkoutPageLogic';
import { RootParamList } from '../navigation/types/appStackTypes';
import { StackScreenProps } from '@react-navigation/stack';
import { TrackingMapItem } from '../types/dto/exerciseTracking.dto';
import { AnalyzeVideoResultPayload, SquatRepetition } from '../types/dto/videoAnalysis.dto';
import { ExerciseInPlan } from '../types/dto/workoutPlans.dto';

const { width, height } = Dimensions.get('window');

export type ExerciseAnalysisOverview = {
  exerciseId: ExerciseInPlan['id'] | null;
  exerciseName: ExerciseInPlan['exercise'] | null;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  resultCount: number;
};

export type CachedExerciseAnalysis = {
  overview: ExerciseAnalysisOverview;
  result: AnalyzeVideoResultPayload<SquatRepetition> | null;
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
  const [analyzeModalIndex, setAnalyzeModalIndex] = useState(-1);
  const [analysisOverview, setAnalysisOverview] = useState<ExerciseAnalysisOverview>({
    exerciseId: null,
    exerciseName: null,
    status: 'idle',
    resultCount: 0,
  });
  const [lastAnalysis, setLastAnalysis] = useState<CachedExerciseAnalysis | null>(null);
  const previousAnalysisStatusRef = useRef<ExerciseAnalysisOverview['status']>('idle');
  const shouldAutoOpenCompletedAnalysisRef = useRef(false);

  const modalRef = useRef<SlidingBottomModalRef | null>(null);
  const analyzeModalRef = useRef<SlidingBottomModalRef | null>(null);
  const openModal = useCallback(() => {
    modalRef?.current?.open?.(0);
  }, []);
  const openAnalyzeModal = useCallback((exercise: ExerciseInPlan) => {
    if (analysisOverview.status === 'processing' && analysisOverview.exerciseId !== exercise.id) {
      showErrorAlert(
        'Analysis in progress',
        `Finish the current ${analysisOverview.exerciseName ?? 'exercise'} analysis before starting another video.`,
      );
      return;
    }

    setSelectedExerciseForAnalysis(exercise);
    analyzeModalRef?.current?.open?.(0);
  }, [analysisOverview.exerciseId, analysisOverview.exerciseName, analysisOverview.status]);

  useEffect(() => {
    const previousStatus = previousAnalysisStatusRef.current;

    if (analysisOverview.status === 'processing' && analyzeModalIndex === -1) {
      shouldAutoOpenCompletedAnalysisRef.current = true;
    }

    if (
      previousStatus === 'processing' &&
      analysisOverview.status === 'completed' &&
      analysisOverview.exerciseId &&
      shouldAutoOpenCompletedAnalysisRef.current &&
      analyzeModalIndex === -1
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

    if (analysisOverview.status === 'idle' || analyzeModalIndex !== -1) {
      shouldAutoOpenCompletedAnalysisRef.current = false;
    }

    previousAnalysisStatusRef.current = analysisOverview.status;
  }, [analysisOverview, analyzeModalIndex, workoutData?.exercisesForSelectedSplit]);

  const handleCacheAnalysis = useCallback(
    (exerciseId: ExerciseInPlan['id'], result: AnalyzeVideoResultPayload<SquatRepetition> | null, overview: ExerciseAnalysisOverview) => {
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

  const handleAnalyzeModalChange = useCallback(
    (index: number) => {
      setAnalyzeModalIndex(index);

      if (index === -1 && analysisOverview.status === 'processing') {
        shouldAutoOpenCompletedAnalysisRef.current = true;
      }
    },
    [analysisOverview.status],
  );

  const handlePressSave = useCallback(async () => {
    let pressedYes = false;

    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Finish Workout?',
      textBody: 'Are you sure you’ve completed your workout?',
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
        onChange={handleAnalyzeModalChange}
      >
        <AnalyzeExerciseSheet
          key={selectedExerciseForAnalysis?.id ?? 'no-exercise-selected'}
          selectedExercise={selectedExerciseForAnalysis}
          analysisOverview={analysisOverview}
          onAnalysisOverviewChange={setAnalysisOverview}
          cachedAnalysis={selectedExerciseForAnalysis?.id === lastAnalysis?.overview.exerciseId ? lastAnalysis?.result ?? null : null}
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
