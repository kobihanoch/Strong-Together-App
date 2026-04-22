import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';

interface RowProps extends ViewProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const Row = ({ children, style, ...rest }: RowProps) => {
  return (
    <View style={[styles.row, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Row;
