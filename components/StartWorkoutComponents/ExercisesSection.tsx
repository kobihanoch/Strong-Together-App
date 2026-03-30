import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../constants/colors';
import { isExerciseAnalysisSupported } from '../../constants/videoAnalysis';
import { ExercisesDuringWorkout, SetCountByExercise } from '../../hooks/types/useStartWorkoutTypes.dto';
import type { CachedExerciseAnalysis, ExerciseAnalysisOverview } from '../../screens/StartWorkout';
import useLastWorkoutExerciseTrackingData from '../../hooks/useLastWorkoutExerciseTrackingData';
import { TrackingMapItem } from '../../types/dto/exerciseTracking.dto';
import { ExerciseInPlan } from '../../types/dto/workoutPlans.dto';
import Column from '../Column';
import NumberCounter from '../NumberCounter';
import PageDots from '../PageDots';
import PercantageCircle from '../PercentageCircle';
import Row from '../Row';
import NumericInputWithRules from './NumericInputWithRules';
import { SquatRepetition } from '../../types/dto/videoAnalysis.dto';

const { height } = Dimensions.get('window');
const defaultAnalysisOverview: ExerciseAnalysisOverview = {
  exerciseId: null,
  exerciseName: null,
  status: 'idle',
  resultCount: 0,
};

type RenderItemProps<T> = {
  item: ExerciseInPlan;
  exercisesSetsDoneMap: SetCountByExercise;
  controls: {
    addNotes: (exerciseName: string, notes: string | null) => void;
    addRepsRecord: (exerciseName: string, setIndex: number, reps: number) => void;
    addWeightRecord: (exerciseName: string, setIndex: number, weight: number) => void;
  };
  workoutProgressObj: ExercisesDuringWorkout;
  setLastWorkoutDataForModal: React.Dispatch<
    React.SetStateAction<{
      lastWorkoutData: TrackingMapItem | null;
      setIndex: number;
    } | null>
  >;
  openModal: () => void;
  openAnalyzeModal: (exercise: ExerciseInPlan) => void;
  analysisOverview?: ExerciseAnalysisOverview;
  lastAnalysis?: CachedExerciseAnalysis<T> | null | undefined;
};

const RenderItem = ({
  item,
  exercisesSetsDoneMap,
  controls,
  workoutProgressObj,
  setLastWorkoutDataForModal,
  openModal,
  openAnalyzeModal,
  analysisOverview = defaultAnalysisOverview,
  lastAnalysis,
}: RenderItemProps<SquatRepetition>) => {
  // Recorded stats
  const { weight: recW = [], reps: recR = [], notes: recNotes } = workoutProgressObj[item?.exercise] || {};
  const exName = item?.exercise;
  const { lastWorkoutData } = useLastWorkoutExerciseTrackingData(item?.id);

  // Controls
  const { addNotes, addWeightRecord, addRepsRecord } = controls || {};

  // Safe destructuring with defaults
  const { planned: plannedSets = 0, done: setsDone = 0 } = exercisesSetsDoneMap[item.exercise] || {};

  // Extra sets
  const [extraSets /*, setExtraSets*/] = useState(0);

  // Pre-calc totals
  const totalSets = plannedSets + extraSets;

  // Progress: compute vs totalSets; clamp to [0, 100]
  const exProgress = totalSets > 0 ? Math.min(100, Math.floor((setsDone / totalSets) * 100)) : 0;

  // Current set number (do not exceed totalSets)
  const currentSetNumber = Math.min(setsDone + 1, Math.max(1, totalSets));

  // Completion state
  const completedAllSets = setsDone >= totalSets && totalSets > 0;

  // Rendered sets (build an array)
  const renderedSets = [];
  for (let setIndex = 0; setIndex < totalSets; setIndex++) {
    //const curW = weights[setIndex];
    //const curR = reps[setIndex];
    const setNumber = setIndex + 1;
    const isSetCompleted = setNumber <= setsDone;
    const isSetInProgress = setNumber == currentSetNumber;
    const isSetLocked = !isSetCompleted && !isSetInProgress;
    const isLastSetDone = setIndex == setsDone - 1;
    const isSetResetable = !isSetLocked && isLastSetDone;

    renderedSets.push(
      <Column
        key={setIndex}
        style={[
          styles.itemSetContainer,
          {
            backgroundColor: isSetCompleted
              ? colors.completedLightTransparent
              : isSetInProgress
                ? colors.lightCardBg
                : '#f2f2f2ff',
            opacity: isSetLocked ? 0.4 : 1,
            borderWidth: isSetLocked ? 0 : 1,
            borderColor: isSetCompleted ? colors.completedLight : colors.primary,
          },
        ]}
      >
        <Row style={{ gap: 10 }}>
          <View
            style={[
              styles.itemCurrentSetNumberContainer,
              {
                backgroundColor: isSetCompleted
                  ? colors.completedLight
                  : isSetInProgress
                    ? colors.primary
                    : '#a3a3a3ff',
              },
            ]}
          >
            <Text style={styles.itemCurrentSetNumberText}>
              {isSetLocked ? <MaterialCommunityIcons name="lock" size={RFValue(10)} /> : setNumber}
            </Text>
          </View>
          <Text style={styles.itemCurrentSetText}>Set {setNumber}</Text>
          <TouchableOpacity
            style={{ marginLeft: 'auto' }}
            disabled={isSetLocked}
            onPress={() => {
              setLastWorkoutDataForModal({ lastWorkoutData, setIndex });
              openModal();
            }}
          >
            <MaterialCommunityIcons name="history" size={RFValue(15)} />
          </TouchableOpacity>
        </Row>
        <Row
          style={{
            marginTop: 20,
            gap: 20,
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Column style={{ width: '50%', gap: 5 }}>
            <Text style={styles.inputHeader}>Weight (kg)</Text>
            <NumericInputWithRules
              initial={setIndex in recW ? recW[setIndex] : 0}
              allowZero={isSetResetable}
              isSetLocked={isSetLocked}
              onValidChange={(val) => {
                addWeightRecord(exName, setIndex, val);
              }}
              style={styles.weightInput}
              keyboardType={'numeric'}
            />
          </Column>
          <Column style={{ width: '50%', gap: 5 }}>
            <Text style={styles.inputHeader}>Reps</Text>
            <NumericInputWithRules
              initial={setIndex in recR ? recR[setIndex] : 0}
              allowZero={isSetResetable}
              isSetLocked={isSetLocked}
              onValidChange={(val) => {
                addRepsRecord(exName, setIndex, val);
              }}
              style={styles.weightInput}
              keyboardType={'number-pad'}
            />
          </Column>
        </Row>
      </Column>,
    );
  }

  const dotLength = plannedSets + extraSets; // or: const dotLength = totalSets;
  const cachedExerciseOverview = lastAnalysis?.overview.exerciseId === item.id ? lastAnalysis.overview : null;
  const effectiveOverview =
    analysisOverview.status === 'processing' && analysisOverview.exerciseId === item.id
      ? analysisOverview
      : (cachedExerciseOverview ?? defaultAnalysisOverview);
  const isCurrentAnalysisExercise = effectiveOverview.exerciseId === item.id;
  const isAnotherExerciseLocked = analysisOverview.status === 'processing' && analysisOverview.exerciseId !== item.id;
  const showInProgressBadge = isCurrentAnalysisExercise && effectiveOverview.status === 'processing';
  const showReadyBadge = isCurrentAnalysisExercise && effectiveOverview.status === 'completed';
  const showFailedBadge = isCurrentAnalysisExercise && effectiveOverview.status === 'failed';
  const isAnalysisSupported = isExerciseAnalysisSupported(item.exercise);
  const isAnalyzeDisabled = isAnotherExerciseLocked || !isAnalysisSupported;

  return (
    <Column style={styles.itemCard}>
      <Row style={{ gap: 10, marginBottom: 20 }}>
        <PercantageCircle percent={exProgress} actualColor={colors.primary} stroke={4} duration={1000}>
          {completedAllSets ? (
            <MaterialCommunityIcons name="check" size={RFValue(12)} style={styles.pctText} />
          ) : (
            <Row>
              <NumberCounter numStart={0} numEnd={exProgress} duration={1000} style={styles.pctText} />
            </Row>
          )}
        </PercantageCircle>

        <Column>
          <Text style={styles.itemExerciseName}>{item.exercise}</Text>
          {/* If you want to show progress vs total including extras: */}
          <Text style={styles.itemSetIndicatorText}>{`${setsDone} of ${totalSets} completed`}</Text>
          {/* If you prefer “planned only”, keep your original line instead */}
        </Column>

        <Column
          style={{
            marginLeft: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <PageDots
            length={dotLength}
            index={Math.min(setsDone, Math.max(0, dotLength - 1))}
            fillColor={colors.completedLight}
            fillToIndex={true}
            activeColor={colors.primary}
            fillAll={completedAllSets}
          />
          {/* Set number badge */}
          <View
            style={[
              styles.badge,
              {
                backgroundColor: completedAllSets ? colors.completedLight : colors.lightCardBg,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: completedAllSets ? colors.completedDark : colors.primary,
                },
              ]}
            >
              {completedAllSets ? 'Done' : `Set ${currentSetNumber}`}
            </Text>
          </View>
        </Column>
      </Row>

      <TouchableOpacity
        style={[
          styles.analyzeBtn,
          isAnalyzeDisabled && styles.analyzeBtnDisabled,
          showReadyBadge && styles.analyzeBtnReady,
        ]}
        onPress={() => openAnalyzeModal(item)}
        disabled={isAnalyzeDisabled}
      >
        <View style={styles.analyzeIconWrap}>
          <MaterialCommunityIcons name="brain" size={RFValue(14)} color={colors.primary} />
        </View>
        <Column style={styles.analyzeTextWrap}>
          <Text style={styles.analyzeBtnText}>Analyze movement</Text>
          <Text style={styles.analyzeBtnSubText}>
            {!isAnalysisSupported
              ? 'Analysis is not available for this exercise yet'
              : isAnotherExerciseLocked
                ? `Wait until ${analysisOverview.exerciseName ?? 'the current exercise'} finishes`
                : showInProgressBadge
                  ? 'AI is processing this clip right now'
                  : showReadyBadge
                    ? 'Results are ready to review'
                    : showFailedBadge
                      ? 'Last analysis failed. Tap to try again'
                      : 'Open the AI motion analysis flow for this exercise'}
          </Text>
        </Column>
        <View style={styles.analyzeTrailing}>
          {showInProgressBadge ? (
            <View style={styles.analysisStatusChip}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.analysisStatusChipText}>In Progress</Text>
            </View>
          ) : null}
          {showReadyBadge ? (
            <View style={styles.analysisReadyChip}>
              <MaterialCommunityIcons name="check-decagram" size={RFValue(13)} color={colors.completedDark} />
              <Text style={styles.analysisReadyChipText}>
                Ready{effectiveOverview.resultCount > 0 ? ` • ${effectiveOverview.resultCount}` : ''}
              </Text>
            </View>
          ) : null}
          {showFailedBadge ? (
            <View style={styles.analysisFailedChip}>
              <MaterialCommunityIcons name="alert-circle-outline" size={RFValue(13)} color={colors.error} />
              <Text style={styles.analysisFailedChipText}>Retry</Text>
            </View>
          ) : null}
          <MaterialCommunityIcons name="chevron-right" size={RFValue(16)} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {renderedSets}

      <TextInput
        style={[styles.notesInput, { textAlignVertical: 'top' }]}
        multiline
        numberOfLines={3}
        maxLength={50}
        onEndEditing={({ nativeEvent }) => {
          addNotes(exName, nativeEvent.text);
        }}
        defaultValue={recNotes ?? ''}
        placeholder="Add any notes..."
        returnKeyType="none"
      />
    </Column>
  );
};

type ExercisesSectionProps<T> = {
  exercises: ExerciseInPlan[];
  exercisesSetsDoneMap: SetCountByExercise;
  controls: {
    addNotes: (exerciseName: string, notes: string | null) => void;
    addRepsRecord: (exerciseName: string, setIndex: number, reps: number) => void;
    addWeightRecord: (exerciseName: string, setIndex: number, weight: number) => void;
  };
  workoutProgressObj: ExercisesDuringWorkout;
  setLastWorkoutDataForModal: React.Dispatch<
    React.SetStateAction<{
      lastWorkoutData: TrackingMapItem | null;
      setIndex: number;
    } | null>
  >;
  openModal: () => void;
  openAnalyzeModal: (exercise: ExerciseInPlan) => void;
  analysisOverview?: ExerciseAnalysisOverview;
  lastAnalysis?: CachedExerciseAnalysis<T> | null | undefined;
};

const ExercisesSection = ({
  exercises,
  exercisesSetsDoneMap,
  controls,
  workoutProgressObj,
  setLastWorkoutDataForModal,
  openModal,
  openAnalyzeModal,
  analysisOverview = defaultAnalysisOverview,
  lastAnalysis,
}: ExercisesSectionProps<SquatRepetition>) => {
  if (!exercises?.length) {
    return (
      <Column
        style={{
          alignSelf: 'center',
          marginTop: 'auto',
          marginBottom: 'auto',
          gap: 20,
        }}
      >
        <ActivityIndicator animating={true} size={'large'} />
        <Text
          style={{
            fontFamily: 'Inter_500SemiBold',
            fontSize: RFValue(15),
            color: 'black',
          }}
        >
          Loading exercises...
        </Text>
      </Column>
    );
  }
  return (
    <KeyboardAwareFlatList
      data={exercises}
      enableResetScrollToCoords={false}
      renderItem={({ item }: { item: ExerciseInPlan }) => (
        <RenderItem
          item={item}
          exercisesSetsDoneMap={exercisesSetsDoneMap}
          controls={controls}
          workoutProgressObj={workoutProgressObj}
          setLastWorkoutDataForModal={setLastWorkoutDataForModal}
          openModal={openModal}
          openAnalyzeModal={openAnalyzeModal}
          analysisOverview={analysisOverview}
          lastAnalysis={lastAnalysis}
        />
      )}
      keyExtractor={(it) => it.exercise}
      enableOnAndroid // turn on automatic handling on Android
      extraScrollHeight={200} // how much to scroll above the focused input
      keyboardShouldPersistTaps="never" // taps on inputs won't dismiss keyboard unexpectedly
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    />
  );
};

const styles = StyleSheet.create({
  itemCard: {
    alignSelf: 'center',
    width: '90%',
    borderRadius: 16,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 25,
    shadowColor: '#585858ff',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    // Android shadow
    elevation: 6,
  },
  itemExerciseName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(13),
    color: 'black',
  },
  itemSetIndicatorText: {
    fontFamily: 'Inter_400Refular',
    fontSize: RFValue(12),
    color: colors.textSecondary,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  analyzeBtnDisabled: {
    opacity: 0.55,
  },
  analyzeBtnReady: {
    backgroundColor: '#eefbf4',
  },
  analyzeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(11),
    color: colors.primary,
  },
  analyzeTextWrap: {
    flex: 1,
    gap: 2,
  },
  analyzeBtnSubText: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(9),
    color: colors.textSecondary,
  },
  analyzeTrailing: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    maxWidth: 110,
    marginLeft: 8,
  },
  analysisStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.72)',
    marginLeft: 'auto',
  },
  analysisStatusChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(9),
    color: colors.primary,
  },
  analysisReadyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    marginLeft: 'auto',
  },
  analysisReadyChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(9),
    color: colors.completedDark,
  },
  analysisFailedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    marginLeft: 'auto',
  },
  analysisFailedChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(9),
    color: colors.error,
  },
  pctText: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(10),
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.lightCardBg,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(10),
    color: colors.primary,
  },
  itemSetContainer: {
    width: '100%',
    backgroundColor: colors.lightCardBg,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 16,
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  itemCurrentSetNumberContainer: {
    backgroundColor: colors.primary,
    height: 30,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCurrentSetNumberText: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(10),
    color: 'white',
  },
  itemCurrentSetText: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(10),
    color: 'black',
  },
  notesInput: {
    height: height * 0.08,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f57a',
    color: 'black',
    fontFamily: 'Inter_400Regular',
    padding: 10,
    borderColor: '#e4e4e4ff',
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 30,
  },
  weightInput: {
    height: height * 0.06,
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: 'black',
    fontFamily: 'Inter_400Regular',
    padding: 10,
    borderColor: '#d2d2d2ff',
    borderWidth: 0.5,
    borderRadius: 10,
    fontSize: RFValue(13),
  },
  inputHeader: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
    color: 'black',
  },
});

export default ExercisesSection;
