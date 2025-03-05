import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientedGoToButton = ({ gradientColors, borderRadius, onPress, title, children }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
            <LinearGradient
                colors={gradientColors}
                style={[styles.gradientButton, { borderRadius }]}
            >
                { children }
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientButton: {
        width: '100%',
        height: 50, // גובה כפתור קבוע (ניתן לשנות)
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default GradientedGoToButton;
