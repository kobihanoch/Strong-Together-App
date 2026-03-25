export type GetWholeUserWorkoutPlanQuery = {
  tz?: string | undefined;
};

export type GetExerciseTrackingQuery = {
  tz?: string | undefined;
};

export type FinishUserWorkoutBody = {
  workout: {
    exercisetosplit_id: number;
    weight: number[];
    reps: number[];
    notes?: string | null | undefined;
  }[];
  workout_start_utc: string;
  tz?: string | undefined;
  workout_end_utc: string;
};

export type AddWorkoutBody = {
  workoutData: Record<
    string,
    {
      id: number;
      sets: number | number[];
      order_index: number;
    }[]
  >;
  tz: string;
  workoutName?: string | undefined;
};
