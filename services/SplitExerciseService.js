import supabase from '../src/supabaseClient';
import { View, Text, StyleSheet, Dimensions, FlatList, TextInput, Alert, TouchableOpacity, Animated } from 'react-native';


export const getExercisesByWorkoutId = async (workoutId) => {
    try {
        const { data, error } = await supabase
            .from('exercisetoworkoutsplit')
            .select(`
                *,
                exercises (description, targetmuscle, specifictargetmuscle)
            `)
            .eq('workout_id', workoutId); 

        //console.log('Data:', data);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching exercises by workout ID:', error.message);
        throw error;
    }
};

export const getExercisesBySplitId = async (splitId) => {
    try {
        const { data, error } = await supabase
            .from('exercisetoworkoutsplit')
            .select(`
                *,
                exercises (description, targetmuscle, specifictargetmuscle)
            `)
            .eq('workoutsplit_id', splitId); 

        //console.log('Data:', data);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error fetching exercises by split ID:', error.message);
        throw error;
    }
};



// Get all exercises from exercises table
export const getAllExercises = async () => {
    try {
        const { data, error } = await supabase
            .from('exercises')
            .select('*'); 

        if (error) throw error;
        return data; 

    } catch (error) {
        console.error('Error fetching all exercises:', error.message);
        throw error;
    }
};
