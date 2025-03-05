import { useState, useEffect } from 'react';
import { getExercisesTrackingByUserId } from '../services/ExerciseTrackingService';

const useExerciseTracking = (userId) => {
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackingData = async () => {
            if (userId) {
                setLoading(true);
                try {
                    const data = await getExercisesTrackingByUserId(userId);
                    setTrackingData(data); // עדכון המצב עם הנתונים שהתקבלו
                } catch (err) {
                    setError(err.message); // עדכון השגיאה במידה ויש
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTrackingData(); // קריאה לפונקציה
    }, [userId]); // תפעיל את ה-effect כש-userId משתנה

    return { trackingData, loading, error }; // החזרת המצב
};

export default useExerciseTracking;
