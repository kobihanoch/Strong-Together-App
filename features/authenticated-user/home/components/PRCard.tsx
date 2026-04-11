import React from 'react';
import { Dimensions, Text, StyleSheet, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from '../../../utils/statisticsUtils';
import { Skeleton } from 'moti/skeleton';
import { useGlobalAppLoadingContext } from '../../../context/GlobalAppLoadingContext';

const { width, height } = Dimensions.get('window');

type PRData = {
  maxExercise: string | null;
  maxDate: string;
  maxWeight: number;
  maxReps: number;
} | null;

interface PRCardProps {
  hasAssignedWorkout?: boolean;
  PR?: PRData | null;
  hasTracking: boolean;
}

const PRCard: React.FC<PRCardProps> = ({ PR, hasTracking }) => {
  const { isLoading } = useGlobalAppLoadingContext();

  return (
    <Skeleton.Group show={isLoading}>
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column', gap: 10 }}>
          <Text style={styles.header}>Personal Record</Text>
          <View style={styles.insideContainer}>
            <View style={{ flexDirection: 'column', gap: 10, flex: 5 }}>
              <Skeleton colorMode="light">
                <View style={styles.card}>
                  <View style={styles.iconHeaderRow}>
                    <MaterialCommunityIcons
                      name={'dumbbell'}
                      size={RFValue(12)}
                      color={'white'}
                      style={[styles.iconStyle, { backgroundColor: '#12c282ff' }]}
                    />
                    <Text style={styles.cardHeader}>Exercise</Text>
                  </View>

                  <Text style={[styles.maxEntity, { fontSize: RFValue(12), marginTop: 15 }]}>
                    {hasTracking ? PR?.maxExercise : 'No data yet'}
                  </Text>
                </View>
              </Skeleton>

              <Skeleton colorMode="light">
                <View style={styles.card}>
                  <View style={styles.iconHeaderRow}>
                    <MaterialCommunityIcons
                      name={'calendar'}
                      size={RFValue(12)}
                      color={'white'}
                      style={[styles.iconStyle, { backgroundColor: '#06B6D4' }]}
                    />
                    <Text style={styles.cardHeader}>Date</Text>
                  </View>
                  <Text style={[styles.maxEntity, { fontSize: RFValue(12), marginTop: 15 }]}>
                    {hasTracking ? formatDate(PR!.maxDate) : 'No data yet'}
                  </Text>
                </View>
              </Skeleton>
            </View>

            <View style={{ flexDirection: 'column', gap: 10, flex: 5 }}>
              <Skeleton colorMode="light">
                <View style={styles.card}>
                  <View style={styles.iconHeaderRow}>
                    <MaterialCommunityIcons
                      name={'weight'}
                      size={RFValue(12)}
                      color={'white'}
                      style={[styles.iconStyle, { backgroundColor: '#ff2979' }]}
                    />
                    <Text style={styles.cardHeader}>Weight</Text>
                  </View>
                  <Text style={[styles.maxEntity, { fontSize: RFValue(16), marginTop: 15 }]}>
                    {hasTracking ? PR?.maxWeight : ''}
                    <Text style={styles.unitText}>{hasTracking ? ' kg' : 'No data yet'}</Text>
                  </Text>
                </View>
              </Skeleton>

              <Skeleton colorMode="light">
                <View style={styles.card}>
                  <View style={styles.iconHeaderRow}>
                    <MaterialCommunityIcons
                      name={'fire'}
                      size={RFValue(12)}
                      color={'white'}
                      style={[styles.iconStyle, { backgroundColor: '#ffaf29' }]}
                    />
                    <Text style={styles.cardHeader}>Reps</Text>
                  </View>
                  <Text style={[styles.maxEntity, { fontSize: RFValue(16), marginTop: 15 }]}>
                    {hasTracking ? PR?.maxReps : ''}
                    <Text style={styles.unitText}> {hasTracking ? 'reps' : 'No data yet'}</Text>
                  </Text>
                </View>
              </Skeleton>
            </View>
          </View>
        </View>
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '90%',
    paddingVertical: height * 0.03,
    paddingHorizontal: height * 0.02,
    alignItems: 'flex-start',
    borderRadius: 15,
    flexDirection: 'column',
    backgroundColor: '#f4f8ffff',
    gap: 10,
  },
  insideContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    flexDirection: 'column',
    height: height * 0.12,
    justifyContent: 'space-between',
  },
  header: {
    fontFamily: 'Inter_600SemiBold',
    color: 'black',
    fontSize: RFValue(15),
    marginBottom: 10,
  },
  iconHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconStyle: {
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    fontFamily: 'Inter_500Medium',
    color: 'black',
    fontSize: RFValue(12),
  },
  maxEntity: {
    fontFamily: 'Inter_500Medium',
    color: 'black',
    fontSize: RFValue(12),
  },
  unitText: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
    opacity: 0.5,
  },
});

export default PRCard;
