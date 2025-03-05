import supabase from '../src/supabaseClient';


export const fetchWorkoutsByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('workoutplans')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
};


export const addWorkout = async ({ user_id, trainer_id, name, numberofsplits, level }) => {
    try {
        const { data, error } = await supabase
            .from('workoutplans')
            .insert([{
                user_id,
                trainer_id,
                name,
                numberofsplits,
                created_at: new Date().toISOString(),
                is_deleted: false, 
                level
            }]);

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error adding new workout:", error);
        return null;
    }
};
