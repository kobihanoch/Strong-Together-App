import { useState, useEffect } from 'react';
import {
  fetchWorkoutSplitsByWorkoutId,
  addWorkoutSplit,
  updateWorkoutSplit,
  deleteWorkoutSplit,
} from '../services/WorkoutSplitsService'; // ייבוא של הפונקציות

const useWorkoutSplits = (workoutId) => {
  const [workoutSplits, setWorkoutSplits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // מצב לבדוק אם הנתונים נטענים

  // פונקציה לשליפת workout splits לפי workout ID
  const fetchSplits = async (workoutId) => {
    setLoading(true); // מתחילים לטעון
    try {
        if (workoutId) { // ודא שה-workoutId קיים
            const splits = await fetchWorkoutSplitsByWorkoutId(workoutId);
            setWorkoutSplits(splits);
        } else {
            
        }
    } catch (error) {
        console.error("Error fetching splits:", error); // לוג שגיאות
        setError(error.message);
    } finally {
        setLoading(false); // מסיימים את הטעינה
    }
};

  useEffect(() => {
    fetchSplits();
  }, [workoutId]); // תלות ב-workoutId

  // הוספת workout split
  const createWorkoutSplit = async (name, createdAt) => {
    setLoading(true);
    try {
      const newSplit = await addWorkoutSplit(workoutId, name, createdAt);
      setWorkoutSplits((prev) => [...prev, newSplit]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // עדכון workout split
  const modifyWorkoutSplit = async (id, name, createdAt) => {
    setLoading(true);
    try {
      const updatedSplit = await updateWorkoutSplit(id, name, createdAt);
      setWorkoutSplits((prev) =>
        prev.map((split) => (split.id === id ? updatedSplit : split))
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // מחיקת workout split
  const removeWorkoutSplit = async (id) => {
    setLoading(true);
    try {
      await deleteWorkoutSplit(id);
      setWorkoutSplits((prev) => prev.filter((split) => split.id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    workoutSplits,
    error,
    loading,
    fetchSplits, // ייצוא הפונקציה
    createWorkoutSplit,
    modifyWorkoutSplit,
    removeWorkoutSplit,
  };
};

export default useWorkoutSplits;
