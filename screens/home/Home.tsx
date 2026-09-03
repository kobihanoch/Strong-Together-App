import React, { useState } from 'react';
import { Skeleton } from 'moti/skeleton';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AchievementCard from './components/AchievementCard';
import AerobicsCard from './components/AerobicsCard';
import HomeHeader from './components/HomeHeader';
import GymActivityCard from './components/GymActivityCard';
import LastWorkoutCard from './components/LastWorkoutCard';
import NextWorkoutCard from './components/NextWorkoutCard';
import NoTrackingCard from './components/NoTrackingCard';
import NoWorkoutCard from './components/NoWorkoutCard';
import useHomeDashboard from './hooks/use-home.hook';
import { colors } from '../../shared/constants/colors';
import { useAppTheme } from '../../shared/providers/AppThemeProvider';
import CardioEntrySheet from '../../features/workouts/cardio/components/CardioEntrySheet';

const Home = () => {
  const { data, actions, loadingStates } = useHomeDashboard();
  const { width, height } = useWindowDimensions();
  const horizontalPadding = Math.max(14, Math.min(width * 0.045, 22));
  const sectionGap = Math.max(12, Math.min(height * 0.016, 18));
  const { mode } = useAppTheme();
  const [cardioOpen, setCardioOpen] = useState(false);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: data.theme.canvas }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding, gap: sectionGap }]}
        showsVerticalScrollIndicator={false}
      >
        <Skeleton.Group show={loadingStates.isPending}>
          <Skeleton colorMode={mode}>
            <HomeHeader data={data.user} theme={data.theme} onInbox={actions.openInbox} />
          </Skeleton>

          {loadingStates.isPending ? (
            <>
              <Skeleton colorMode={mode}>
                <NextWorkoutCard data={data.nextWorkout} theme={data.theme} isFirstWorkout={false} onStart={actions.startWorkout} />
              </Skeleton>
              <Skeleton colorMode={mode}>
                <GymActivityCard data={data.gymActivity} theme={data.theme} />
              </Skeleton>
              <Skeleton colorMode={mode}>
                <AerobicsCard data={data.aerobics} theme={data.theme} onLog={() => setCardioOpen(true)} />
              </Skeleton>
              <Skeleton colorMode={mode}>
                <AchievementCard data={data.achievement} theme={data.theme} onPress={actions.openProgress} />
              </Skeleton>
              <Skeleton colorMode={mode}>
                <LastWorkoutCard data={data.lastWorkout} theme={data.theme} onPress={actions.openHistory} />
              </Skeleton>
            </>
          ) : (
            <>
              {data.state.hasWorkout ? (
                <NextWorkoutCard
                  data={data.nextWorkout}
                  theme={data.theme}
                  isFirstWorkout={!data.state.hasTracking}
                  onStart={actions.startWorkout}
                />
              ) : (
                <NoWorkoutCard theme={data.theme} onCreate={actions.createWorkout} />
              )}

              {data.state.hasTracking ? (
                <>
                  <GymActivityCard data={data.gymActivity} theme={data.theme} />
                  <AchievementCard data={data.achievement} theme={data.theme} onPress={actions.openProgress} />
                  <LastWorkoutCard data={data.lastWorkout} theme={data.theme} onPress={actions.openHistory} />
                </>
              ) : data.state.hasWorkout ? (
                <NoTrackingCard theme={data.theme} />
              ) : null}
              <AerobicsCard data={data.aerobics} theme={data.theme} onLog={() => setCardioOpen(true)} />
            </>
          )}
        </Skeleton.Group>
      </ScrollView>
      <CardioEntrySheet
        visible={cardioOpen}
        saving={loadingStates.isCardioUpdating}
        theme={data.theme}
        onClose={() => setCardioOpen(false)}
        onSave={async (entry) => {
          await actions.logCardio(entry);
          setCardioOpen(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { flexGrow: 1, paddingTop: 12, paddingBottom: 28 },
});

export default Home;
