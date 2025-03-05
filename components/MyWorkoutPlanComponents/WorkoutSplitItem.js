import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');

const WorkoutSplitItem = ({ item, exercise_count, isSelected, onPress }) => (
    <TouchableOpacity
        style={[styles.splitContainer, isSelected && styles.selectedSplitContainer]}
        onPress={onPress}
    >
        <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: width * 0.04 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 0.45 }}>
                <Text style={[styles.splitName, { color: isSelected ? '#8ca7d1' : '#002855' }]}>{item.name}</Text>
                <FontAwesome5 name="bolt" size={15} color={isSelected ? '#8ca7d1' : '#002855'}  />
            </View>
            <View style={{ flex: 0.55, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={[styles.splitExercises, { color: isSelected ? '#8ca7d1' : '#002855' }]}>{exercise_count} exercises</Text>
                {isSelected && (
                    <Image
                        source={require('../../assets/barbell.png')}
                        style={{ height: height * 0.12, width: height * 0.12, marginLeft: width * 0.2, marginTop: height * 0.0, opacity: 0.2, tintColor: 'white' }}
                    />
                )}
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    splitContainer: {
        padding: height * 0.01,
        flex: 1,
        backgroundColor: 'white',
        width: width * 0.5,
        borderRadius: width * 0.04,
        borderColor: '#c9c9c9',
        borderWidth: 0.2,
        marginLeft: width * 0.05,
        marginVertical: height * 0.02,
    },
    selectedSplitContainer: {
        backgroundColor: '#0d2540',
        width: width * 0.7,
    },
    splitName: {
        fontFamily: 'PoppinsBold',
        fontSize: RFValue(25),
    },
    splitExercises: {
        fontFamily: 'PoppinsRegular',
        fontSize: RFValue(12),
        color: '#666',
    },
});

export default WorkoutSplitItem;
