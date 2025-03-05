import React from 'react';
import { View, StyleSheet } from 'react-native';

const Row = ({ children, spacing = 10 }) => {
    return (
        <View style={[styles.row, { marginHorizontal: spacing / 2 }]}>
            {React.Children.map(children, (child) => (
                <View style={{ marginHorizontal: spacing / 2 }}>
                    {child}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
});

export default Row;
