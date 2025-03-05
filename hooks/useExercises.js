import { useState, useEffect } from 'react';
import supabase from '../src/supabaseClient';

const useExercises = (workoutSplitId = null) => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        // שליפת כל השדות מ-'exercisetoworkoutsplit'
        let query = supabase
          .from('exercisetoworkoutsplit')
          .select('id, exercise_id, sets, workoutsplit_id, created_at, exercise, workoutsplit');

        if (workoutSplitId) {
          query = query.eq('workoutsplit_id', workoutSplitId); // סינון לפי workoutSplitId
        }

        const { data: exercisesData, error: exercisesError } = await query;
        if (exercisesError) throw exercisesError;

        // שליפת כל השדות מ-'exercises'
        const exerciseIds = exercisesData.map((exercise) => exercise.exercise_id);
        const { data: exerciseDetails, error: exerciseDetailsError } = await supabase
          .from('exercises')
          .select('id, name, description, targetmuscle, specifictargetmuscle') 
          .in('id', exerciseIds);
        
        if (exerciseDetailsError) throw exerciseDetailsError;

        // שליפת כל השדות מ-'workoutsplits'
        const workoutSplitIds = exercisesData.map((exercise) => exercise.workoutsplit_id);
        const { data: workoutSplitDetails, error: workoutSplitError } = await supabase
          .from('workoutsplits')
          .select('id, name, workout_id, muscle_group, created_at')
          .in('id', workoutSplitIds);

        if (workoutSplitError) throw workoutSplitError;

        // שילוב הנתונים מהטבלאות
        const exercisesWithDetails = exercisesData.map((exercise) => {
          const exerciseDetail = exerciseDetails.find((detail) => detail.id === exercise.exercise_id);
          const workoutSplitDetail = workoutSplitDetails.find((split) => split.id === exercise.workoutsplit_id);

          return {
            ...exercise, // שמירה על כל השדות מטבלת exercisetoworkoutsplit
            targetmuscle: exerciseDetail ? exerciseDetail.targetmuscle : 'N/A',
            specifictargetmuscle: exerciseDetail ? exerciseDetail.specifictargetmuscle : 'N/A',
            name: exerciseDetail ? exerciseDetail.name : 'Unknown',
            description: exerciseDetail ? exerciseDetail.description : 'No Description',
            workoutsplit_name: workoutSplitDetail ? workoutSplitDetail.name : 'Unknown Split',
            muscle_group: workoutSplitDetail ? workoutSplitDetail.muscle_group : 'N/A',
          };
        });

        setExercises(exercisesWithDetails);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchExercises();
  }, [workoutSplitId]);

  return { exercises, error };
};

export default useExercises;