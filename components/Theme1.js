import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import TopComponent from '../components/TopComponent';

const { width, height } = Dimensions.get('window');

const Theme1 = ({ children, header, lowerPartColor = 'white' }) => {
  return (
    <View style={styles.container}>
      <TopComponent header={header} />

      <View style={[styles.lowerPart, { backgroundColor: lowerPartColor }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  lowerPart: {
    flex: 1,
    position: 'absolute',
    top: height * 0.14, // מקם את החלק התחתון בצורה מדויקת מתחת ל-TopComponent
    left: 0,
    right: 0,
    bottom: 0,
    borderTopRightRadius: height * 0.04,
    borderTopLeftRadius: height * 0.04,
    overflow: 'hidden', // מסתיר כל חלק מהתוכן שיוצא מהגבולות
  },
});

export default Theme1;
