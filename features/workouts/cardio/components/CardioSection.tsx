import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../../shared/constants/colors';
import { AerobicsDailyRecord, WeeklyData } from '@strong-together/shared';
import { formatTime } from '../../../../shared/utils/shared-utils';
import Column from '../../../../shared/components/Column';
import Row from '../../../../shared/components/Row';
import CardioWeeklyGraph from './CardioWeeklyGraph';

const { width, height } = Dimensions.get('window');

const CardioSection = ({
  daily,
  weekly,
}: {
  daily: AerobicsDailyRecord[] | undefined;
  weekly: WeeklyData | undefined;
}) => {
  const { duration_mins: minutes = null, duration_sec: seconds = null, type = null } = daily?.[0] || {};
  const hasDailyCardio = !!minutes;
  const durationText = formatTime(minutes, seconds);
  const typeText = hasDailyCardio && type ? String(type) : 'None';

  const { records = null, total_duration_mins: totalMins = null } = weekly || {};

  const [weeklyCardioCardW, setWeeklyCardioW] = useState(0);

  return (
    <Column style={styles.container}>
      <View style={styles.card}>
        <Row style={{ gap: 10 }}>
          <Text style={styles.dailyTitle}>Daily Cardio</Text>
        </Row>
        <Column style={styles.durationContainer}>
          <Text style={styles.durationHeader}>Duration</Text>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.durationText}>{hasDailyCardio ? durationText : 'None'}</Text>
            <MaterialCommunityIcons name={'timer'} color="black" size={RFValue(15)}></MaterialCommunityIcons>
          </Row>
        </Column>
        <Column style={styles.durationContainer}>
          <Text style={styles.durationHeader}>Type</Text>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.durationText}>{typeText}</Text>
            <MaterialCommunityIcons name={'heart-pulse'} color="black" size={RFValue(15)}></MaterialCommunityIcons>
          </Row>
        </Column>
      </View>

      <View testID="weekly-card" style={[styles.card, { gap: 20 }]} onLayout={(e) => setWeeklyCardioW(e.nativeEvent.layout.width)}>
        <Row style={{ gap: 10 }}>
          <Text style={styles.dailyTitle}>Weekly Cardio</Text>
        </Row>
        <Text style={styles.weeklyTotal}>Total: {totalMins ?? 0} mins</Text>
        {records ? (
          <CardioWeeklyGraph data={records} cardWidth={weeklyCardioCardW} />
        ) : (
          <View>
            <View>
              <MaterialCommunityIcons name="heart-off" size={RFValue(18)} color={colors.textSecondary} />
            </View>
            <Text>No cardio assigned</Text>
            <Text>Log a cardio session to see the weekly chart</Text>
          </View>
        )}
      </View>
    </Column>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 20,
  },
  card: {
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    backgroundColor: 'white',
    borderRadius: 16,
    alignSelf: 'center',
    width: '90%',
    flexDirection: 'column',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(13,59,102,0.06)',
  },
  dailyTitle: {
    color: 'black',
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(13),
  },
  durationContainer: {
    marginTop: 20,
    backgroundColor: colors.lightCardBg,
    padding: height * 0.02,
    borderRadius: 16,
    gap: 5,
  },
  durationHeader: {
    color: 'black',
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
  },
  durationText: {
    color: 'black',
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(20),
  },
  weeklyTotal: {
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
  },
});

export default CardioSection;
