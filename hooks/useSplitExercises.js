import { useState } from 'react';
import { addExerciseToSplit, getExercisesBySplitId, getExercisesByWorkoutId } from '../services/SplitExerciseService';

const useSplitExercises = (workoutId) => {
    const [splitExercises, setSplitExercises] = useState([]);
    const [allExercises, setAllExercises] = useState([]); // הוספת מצב לכל התרגילים
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch exercises by split ID
    const fetchExercisesBySplitId = async (splitId) => {
        try {
            setLoading(true);
            const exercises = await getExercisesBySplitId(splitId);
            setSplitExercises(exercises);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all exercises by workout ID
    const fetchAllExercises = async (workoutId) => {
        setLoading(true);
        try {
            const exercises = await getExercisesByWorkoutId(workoutId);
            setAllExercises(exercises); // עדכון allExercises עם התוצאות
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    
    
    

    // Add new exercise to a specific split
    const addExercise = async (splitId, exerciseId) => {
        try {
            setLoading(true);
            const newExerciseData = {
                workoutsplit_id: splitId,
                exercise_id: exerciseId,
                created_at: new Date().toISOString(),
            };
            const newExercise = await addExerciseToSplit(newExerciseData);
            setSplitExercises((prevExercises) => [...prevExercises, newExercise[0]]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        splitExercises,
        allExercises, // החזרת allExercises
        loading,
        error,
        fetchExercisesBySplitId,
        addExercise,
        fetchAllExercises
    };
};

export default useSplitExercises;
