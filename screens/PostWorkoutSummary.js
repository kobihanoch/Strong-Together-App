// PostWorkoutSummary.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import useExerciseTrackingByDateAndSplit from '../hooks/useExerciseTrackingByDateAndSplit';
import { useAuth } from '../context/AuthContext'; 
import Theme1 from '../components/Theme1';
import LoadingPage from '../components/LoadingPage';



const { width, height } = Dimensions.get('window');

const PostWorkoutSummary = ({ route }) => {
    const { workoutData, workoutSplitID, userId } = route.params;

    const [ workoutDate, setWorkoutDate ] = useState(null);
    useEffect(() => {
        if (workoutData && workoutData.length > 0) {
            setWorkoutDate(workoutData[0].workoutdate);
        }
    }, [workoutData]);

    const { trackingData: workoutExercisesSummary, loading: loading1, error } = useExerciseTrackingByDateAndSplit(userId, workoutDate, workoutSplitID);
    const [delayFinishedLoading, setDelayFinishedLoading] = useState(false);

    useEffect(() => {
      if (!loading1) {
          const delayTimeout = setTimeout(() => {
              setDelayFinishedLoading(true);
          }, 7000); 

          return () => clearTimeout(delayTimeout); 
      }
    }, [loading1]);

    if (loading1 || !delayFinishedLoading) {
        return <LoadingPage message='Checking your performance...' />;
    }

    

    const renderWorkoutItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.exerciseText}>{item.exercise}</Text>
            <Text style={styles.detailsText}>Weights: {(item.weight || []).join(', ')}</Text>
            <Text style={styles.detailsText}>Reps: {(item.reps || []).join(', ')}</Text>
        </View>
    );

  return (
    <View style={{flex: 1, paddingVertical: height * 0.02,}}>
      <Text style={styles.header}>Workout Summary</Text>
      <FlatList
        data={workoutExercisesSummary}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: RFValue(24),
    fontFamily: 'PoppinsBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseText: {
    fontSize: RFValue(18),
    fontFamily: 'PoppinsBold',
    color: '#333',
  },
  detailsText: {
    fontSize: RFValue(14),
    fontFamily: 'PoppinsRegular',
    color: '#666',
  },
});

export default PostWorkoutSummary;
