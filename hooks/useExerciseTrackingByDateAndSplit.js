import { useState, useEffect } from 'react';
import { getExercisesTrackingByUserIdDateAndSplit } from '../services/ExerciseTrackingService';

const useExerciseTrackingByDateAndSplit = (userId, workoutDate, splitId) => {
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackingData = async () => {
            if (userId && workoutDate && splitId) {
                setLoading(true);
                try {
                    const data = await getExercisesTrackingByUserIdDateAndSplit(userId, workoutDate, splitId);
                    setTrackingData(data); // עדכון המצב עם הנתונים שהתקבלו
                } catch (err) {
                    setError(err.message); // עדכון השגיאה במידה ויש
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTrackingData(); // קריאה לפונקציה
    }, [userId, workoutDate, splitId]); // תפעיל את ה-effect כשאחד מהפרמטרים משתנה

    return { trackingData, loading, error }; // החזרת המצב
};

export default useExerciseTrackingByDateAndSplit;
