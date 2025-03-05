import { useState, useEffect } from 'react';
import { fetchWorkoutsByUserId, addWorkout, deleteWorkout, updateWorkout } from '../services/WorkoutService';

export const useWorkouts = (userId) => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getWorkoutByUserId = async () => {
        if (!userId) return; // בדיקה אם userId קיים
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWorkoutsByUserId(userId);
            setWorkouts(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            getWorkoutByUserId(); // קריאה לשליפת האימונים כאשר userId משתנה
        }
    }, [userId]);

    // החזרת האימון הראשון אם קיים, או null אם אין אימונים
    const workout = workouts.length > 0 ? workouts[0] : null;

    return { workout, loading, error, getWorkoutByUserId };
};

export default useWorkouts;
