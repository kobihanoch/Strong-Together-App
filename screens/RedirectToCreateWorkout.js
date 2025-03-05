// MyWorkoutPlan.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import TopComponent from '../components/TopComponent';
import useWorkoutSplits from '../hooks/useWorkoutSplits';
import useExercises from '../hooks/useExercises';
import { RFValue } from 'react-native-responsive-fontsize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Theme1 from '../components/Theme1';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const MyWorkoutPlan = ({ navigation }) => {
    const { user, logout } = useAuth();

    return (
        <Theme1>
            
        </Theme1>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upperPart: {
    flex: 0.22,
    backgroundColor: '#007bff',
  },
  lowerPart: {
    flex: 0.67,
  },
});

export default MyWorkoutPlan;
