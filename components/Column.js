import React from 'react';
import { View, StyleSheet } from 'react-native';

const Column = ({ children, spacing = 10 }) => {
    return (
        <View style={[styles.column, { marginVertical: spacing / 2 }]}>
            {React.Children.map(children, (child) => (
                <View style={{ marginVertical: spacing / 2 }}>
                    {child}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
});

export default Column;
