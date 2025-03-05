import React, { useRef, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomTabBar from '../components/BottomTabBar';
import Theme1 from '../components/Theme1';

const { width, height } = Dimensions.get('window');


const Settings = ({ navigation }) => {
  

  return (
    <View style={{flex: 1, paddingVertical: height * 0.02,}}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'skyblue',
    marginBottom: 10,
  },
});

export default Settings;