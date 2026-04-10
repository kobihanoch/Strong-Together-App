import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import CalendarStripCustom from '../history/components/CalenderStripCustom';
import CardioSection from '../cardio/components/CardioSection';
import ExercisesFlatList from '../history/components/ExercisesFlatList';
import TabSelect, { TabSelectHandleRef } from '../history/components/TabSelect';
import WorkoutHeader from '../history/components/WorkoutHeader';
import { useGlobalAppLoadingContext } from '../../../context/GlobalAppLoadingContext';
import useStatisticsPageLogic from '../history/hooks/use-statistics-page-logic.hook';

const { width, height } = Dimensions.get('window');

const StatisticsPage = () => {
  const {
    selectedDate,
    setSelectedDate,
    exerciseTrackingByDate, // Workout for date X
    exerciseTrackingByDatePrev, // Array of all last performences of all exercises
    exerciseTrackingWithDateKey, // Map of [date] => [...exercisetracking logs]
    cardioByDate, // Cardio for date X
    cardioForWeek, // Cardio for week starting at sunday date Y
  } = useStatisticsPageLogic();

  const { isLoading } = useGlobalAppLoadingContext();

  const [index, setIndex] = useState(0);

  const cardioDotRef = useRef<TabSelectHandleRef | null>(null);

  useEffect(() => {
    if (cardioByDate) cardioDotRef?.current?.showCardioDot();
    else {
      cardioDotRef?.current?.hideCardioDot();
    }
  }, [cardioByDate]);

  useEffect(() => {
    setIndex(exerciseTrackingByDate && exerciseTrackingByDate.length ? 0 : cardioByDate ? 1 : 0);
  }, [exerciseTrackingByDate, cardioByDate]);

  if (isLoading) return null;

  return (
    <ScrollView style={styles.pageContainer} showsVerticalScrollIndicator={false}>
      <CalendarStripCustom
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        userExerciseLogs={exerciseTrackingWithDateKey}
      />
      <TabSelect index={index} setIndex={setIndex} ref={cardioDotRef}></TabSelect>
      {index == 0 ? <WorkoutHeader data={exerciseTrackingByDate} selectedDate={selectedDate}></WorkoutHeader> : null}
      {index === 0 ? (
        <ExercisesFlatList
          data={exerciseTrackingByDate}
          dataToCompare={exerciseTrackingByDatePrev || []}
        ></ExercisesFlatList>
      ) : (
        <CardioSection daily={cardioByDate} weekly={cardioForWeek}></CardioSection>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(17),
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: height * 0,
    paddingHorizontal: width * 0,
  },
});

export default StatisticsPage;


