import supabase from '../src/supabaseClient';


export const getExercisesTrackingByUserId = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('exercisetracking')
            .select('*')
            .eq('user_id', userId); 

        if (error) throw error; 

        console.log('Fetched exercise tracking data:', data); 
        return data; 
    } catch (error) {
        console.error('Error fetching exercise tracking data:', error.message);
        throw error;
    }
};

export const getExercisesTrackingByUserIdDateAndSplit = async (userId, workoutDate, splitId) => {
    try {
        const { data, error } = await supabase
            .from('exercisetracking')
            .select('*')
            .eq('user_id', userId)               
            .eq('workoutdate', workoutDate)     
            .eq('workoutsplit_id', splitId);    

        if (error) throw error; 

        console.log('Fetched exercise tracking data by user, date, and split ID:', data); 
        return data; 
    } catch (error) {
        console.error('Error fetching exercise tracking data:', error.message);
        throw error; 
    }
};
