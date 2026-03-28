import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

interface Theme1Props {
  children?: ReactNode;
  header?: ReactNode;
  lowerPartColor?: string;
}

const Theme1: React.FC<Theme1Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, backgroundColor: 'blue' }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  lowerPart: {
    flex: 7,
    position: 'absolute',
    top: height * 0.14,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopRightRadius: height * 0.0,
    borderTopLeftRadius: height * 0.0,
    overflow: 'hidden',
  },
});

export default Theme1;
