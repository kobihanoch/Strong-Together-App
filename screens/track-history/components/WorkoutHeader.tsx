import React from 'react';
import Row from '../../../../shared/components/Row';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Column from '../../../../shared/components/Column';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../../shared/constants/colors';
import { formatDate } from '../../../../shared/utils/shared-utils';
import { TrackingMapItem } from '../../shared/types/workout.types';

const { height } = Dimensions.get('window');

const WorkoutHeader = ({
  data,
  selectedDate,
}: {
  data: Omit<TrackingMapItem, 'workoutDate'>[] | undefined;
  selectedDate: string;
}) => {
  const workoutForDate = data?.length ? data[0] : null;

  return (
    <Row style={{ alignItems: 'center', marginTop: 20, marginHorizontal: 10 }}>
      <View style={styles.capitalContainer}>
        <Text style={styles.capitalText}>{workoutForDate ? workoutForDate.splitName : 'R'}</Text>
      </View>
      <Column>
        <Text style={styles.workoutTitle}>{workoutForDate ? 'Workout ' + workoutForDate.splitName : 'Rest day'}</Text>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  workoutTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(15),
    color: 'black',
    marginHorizontal: 10,
  },
  dateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(11),
    color: colors.textSecondary,
    marginHorizontal: 10,
  },
  capitalContainer: {
    backgroundColor: colors.lightCardBg,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    aspectRatio: 1,
    marginLeft: 10,
  },
  capitalText: {
    color: 'black',
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(17),
  },
});

export default WorkoutHeader;
