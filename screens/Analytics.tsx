import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Estimated1RM from '../components/AnalyticsComponents.js/Estimated1RM';
import GoalAdherence from '../components/AnalyticsComponents.js/GoalAdherence';
import Overview from '../components/AnalyticsComponents.js/Overview';
import RenderEst1RMItem from '../components/AnalyticsComponents.js/RenderEst1RMItem';
import RenderGoalAdherenceItem from '../components/AnalyticsComponents.js/RenderGoalAdherenceItem';
import SlidingBottomModal, { SlidingBottomModalRef } from '../components/SlidingBottomModal';
import useAnalysticsLogic from '../hooks/logic/useAnalysticsLogic';
import { WorkoutSplitEntity } from '../types/entities/workoutSplit.entity';
import { ExerciseEntity } from '../types/entities/exercise.entity';
import { AdherenceExerciseStats } from '../types/dto/analytics.dto';

const { height } = Dimensions.get('window');

const Analytics = () => {
  const { data, hasData } = useAnalysticsLogic();
  const { overview, _1rms, adherence } = data;

  const RMSModalRef = useRef<SlidingBottomModalRef | null>(null);
  const goalAdherenceModalRef = useRef<SlidingBottomModalRef | null>(null);

  const [selectedAdh, setSelectedAdh] = useState<{
    name: WorkoutSplitEntity['name'];
    v: Record<ExerciseEntity['name'], AdherenceExerciseStats>;
  } | null>(null); // { name, v }

  const openRMSModal = useCallback(() => {
    goalAdherenceModalRef.current?.close();
    RMSModalRef.current?.open?.(1);
  }, []);

  const openGoalAdherenceModal = useCallback(
    (name: WorkoutSplitEntity['name'], v: Record<ExerciseEntity['name'], AdherenceExerciseStats>) => {
      setSelectedAdh({ name, v });
      RMSModalRef.current?.close();
      goalAdherenceModalRef.current?.open?.(1);
    },
    [],
  );

  return (
    <View style={{ flex: 1, paddingTop: height * 0.07 }}>
      <ScrollView style={{ width: '100%', flex: 1 }} showsVerticalScrollIndicator={false}>
        <Overview overViewData={overview} hasData={hasData} />
        <GoalAdherence
          adherenceData={adherence}
          hasData={hasData}
          onSeeAll={openGoalAdherenceModal} // will receive (name, v)
        />
        <Estimated1RM rmData={_1rms} hasData={hasData} onSeeAll={openRMSModal} />
      </ScrollView>

      {/* RMS modal (unchanged) */}
      <SlidingBottomModal
        title="All Estimated 1RMs"
        ref={RMSModalRef}
        data={Object.entries(_1rms.rm)}
        renderItem={({ item }) => {
          const [k, v] = item;
          return <RenderEst1RMItem k={k} v={v} />;
        }}
        snapPoints={['60%', '60%', '80%']}
        flatListUsage={true}
      />

      {/* Goal Adherence modal: show ONLY the selected name */}
      <SlidingBottomModal
        title={'Goal Adherence'}
        ref={goalAdherenceModalRef}
        data={selectedAdh ? [[selectedAdh.name, selectedAdh.v]] : []} // only one entry
        renderItem={({
          item,
        }: {
          item: [WorkoutSplitEntity['name'], Record<ExerciseEntity['name'], AdherenceExerciseStats>];
        }) => {
          const [name, v] = item;
          return (
            <RenderGoalAdherenceItem
              name={name}
              v={v}
              showSeeAll={false} // no button inside modal
              // no 'limit' -> show all sub-entries
            />
          );
        }}
        snapPoints={['60%', '60%', '80%']}
        flatListUsage={true}
      />
    </View>
  );
};

export default Analytics;
