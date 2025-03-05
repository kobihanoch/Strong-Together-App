import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProgressBar = ({ progress }) => {
    const progressAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [progress]);


    const getGradientColors = () => {
        if (progress <= 50) {
            return ['#FFA500', '#FF4500']; 
        } else if (progress <= 75) {
            return ['#FACC15', '#FFA500']; 
        } else {
            return ['#006323', '#125c2c']; 
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.progress,
                    {
                        width: progressAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            >
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height * 0.018,
        backgroundColor: '#16283b',
        borderBottomRightRadius: width * 0.06,
        borderBottomLeftRadius: width * 0.06,
        overflow: 'hidden',
        marginBottom: 20,
        justifyContent: 'center',
    },
    progress: {
        height: '100%',
        overflow: 'hidden',
        borderTopRightRadius: width * 0.06,
    },
    gradient: {
        height: '100%',
        width: '100%',
    },
});

export default ProgressBar;
