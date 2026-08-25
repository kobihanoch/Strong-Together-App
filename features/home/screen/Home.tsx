import React from 'react';
import { Skeleton } from 'moti/skeleton';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AchievementCard from '../components/AchievementCard';
import AerobicsCard from '../components/AerobicsCard';
import HomeHeader from '../components/HomeHeader';
import GymActivityCard from '../components/GymActivityCard';
import LastWorkoutCard from '../components/LastWorkoutCard';
import NextWorkoutCard from '../components/NextWorkoutCard';
import NoTrackingCard from '../components/NoTrackingCard';
import NoWorkoutCard from '../components/NoWorkoutCard';
import useHomePageLogic from '../hooks/use-home-page-logic.hook';
import { colors } from '../../../shared/constants/colors';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const Home = () => {
  const { data, actions, isLoading } = useHomePageLogic();
  const { width, height } = useWindowDimensions();
  const horizontalPadding = Math.max(14, Math.min(width * 0.045, 22));
  const sectionGap = Math.max(12, Math.min(height * 0.016, 18));
  const { mode } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: data.theme.canvas }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding, gap: sectionGap }]}
        showsVerticalScrollIndicator={false}
      >
        <Skeleton.Group show={isLoading}>
          <Skeleton colorMode={mode}>
            <HomeHeader data={data.user} theme={data.theme} onInbox={actions.openInbox} />
          </Skeleton>

          {isLoading ? (
            <>
              <Skeleton colorMode={mode}>
                <NextWorkoutCard data={data.nextWorkout} theme={data.theme} isFirstWorkout={false} onStart={actions.startWorkout} />
              </Skeleton>
              <Skeleton colorMode={mode}>
                <GymActivityCard data={data.gymActivity} theme={data.theme} />
              </Skeleton>
              <Skeleton colorMode={mode}>
                <AerobicsCard data={data.aerobics} theme={data.theme} />
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
                  <AerobicsCard data={data.aerobics} theme={data.theme} />
                  <AchievementCard data={data.achievement} theme={data.theme} onPress={actions.openProgress} />
                  <LastWorkoutCard data={data.lastWorkout} theme={data.theme} onPress={actions.openHistory} />
                </>
              ) : data.state.hasWorkout ? (
                <NoTrackingCard theme={data.theme} />
              ) : null}
            </>
          )}
        </Skeleton.Group>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingTop: 12, paddingBottom: 28 },
});

export default Home;
