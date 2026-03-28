import type {
  AnalysisContextAnalyzedExerciseTrackingData,
  AnalysisContextExerciseTrackingMaps,
} from '../../context/types/analysisContextTypes.dto';
import type { AppUser } from '../../context/types/authContextTypes.dto';
import type { WholeUserWorkoutPlan, WorkoutSplitsMap } from '../../types/dto/workoutPlans.dto';

export interface UserTestProfile {
  key: 'guest' | 'userWithoutWorkout' | 'userWithWorkoutNoHistory' | 'userWithWorkoutAndHistory';
  user: AppUser | null;
  workout: WholeUserWorkoutPlan | null;
  workoutForEdit: WorkoutSplitsMap | null;
  exerciseTrackingMaps: AnalysisContextExerciseTrackingMaps | null;
  analyzedExerciseTrackingData: AnalysisContextAnalyzedExerciseTrackingData | null;
}

const baseUser: AppUser = {
  id: 'user-1',
  username: 'johnny',
  email: 'john@example.com',
  name: 'John Doe',
  gender: 'Male',
  created_at: '2026-03-25T10:00:00.000Z',
  profile_image_url: null,
  push_token: null,
  role: 'user',
  is_first_login: false,
  token_version: 1,
  is_verified: true,
  auth_provider: 'email',
};

const baseWorkout: WholeUserWorkoutPlan = {
  id: 7,
  name: 'Strength Builder',
  numberofsplits: 2,
  created_at: '2026-03-20T08:00:00.000Z',
  is_deleted: false,
  level: 'Intermediate',
  user_id: 'user-1',
  trainer_id: 'trainer-1',
  is_active: true,
  updated_at: '2026-03-26T08:00:00.000Z',
  workoutsplits: [
    {
      id: 11,
      name: 'A',
      workout_id: 7,
      created_at: '2026-03-20T08:00:00.000Z',
      is_active: true,
      muscle_group: 'Chest(Major)',
      exercisetoworkoutsplit: [
        {
          id: 20,
          sets: [10, 8, 8],
          is_active: true,
          targetmuscle: 'Chest',
          specifictargetmuscle: 'Major',
          exercise: 'Bench Press',
          workoutsplit: 'A',
        },
      ],
    },
    {
      id: 12,
      name: 'B',
      workout_id: 7,
      created_at: '2026-03-20T08:00:00.000Z',
      is_active: true,
      muscle_group: 'Back(Lats)',
      exercisetoworkoutsplit: [
        {
          id: 21,
          sets: [12, 12, 10],
          is_active: true,
          targetmuscle: 'Back',
          specifictargetmuscle: 'Lats',
          exercise: 'Lat Pulldown',
          workoutsplit: 'B',
        },
      ],
    },
  ],
};

const baseWorkoutForEdit: WorkoutSplitsMap = {
  A: [
    {
      id: 1,
      name: 'Bench Press',
      sets: [10, 8, 8],
      order_index: 0,
      targetmuscle: 'Chest',
      specifictargetmuscle: 'Major',
    },
  ],
  B: [
    {
      id: 2,
      name: 'Lat Pulldown',
      sets: [12, 12, 10],
      order_index: 0,
      targetmuscle: 'Back',
      specifictargetmuscle: 'Lats',
    },
  ],
};

const baseExerciseTrackingMaps: AnalysisContextExerciseTrackingMaps = {
  byDate: {
    '2026-03-27': [
      {
        id: 9001,
        exercisetosplit_id: 101,
        exercise_id: 1,
        workoutsplit_id: 11,
        splitname: 'A',
        exercise: 'Bench Press',
        order_index: 0,
        weight: [80, 85, 85],
        reps: [10, 8, 8],
        notes: null,
        exercisetoworkoutsplit: {
          sets: [10, 8, 8],
          exercises: {
            targetmuscle: 'Chest',
            specifictargetmuscle: 'Upper Chest',
          },
        },
      },
    ],
  },
  byETSId: {
    101: [
      {
        id: 9001,
        exercisetosplit_id: 101,
        exercise_id: 1,
        workoutsplit_id: 11,
        splitname: 'A',
        exercise: 'Bench Press',
        workoutdate: '2026-03-27',
        order_index: 0,
        weight: [80, 85, 85],
        reps: [10, 8, 8],
        notes: null,
        exercisetoworkoutsplit: {
          sets: [10, 8, 8],
          exercises: {
            targetmuscle: 'Chest',
            specifictargetmuscle: 'Upper Chest',
          },
        },
      },
    ],
  },
  bySplitName: {
    A: [
      {
        id: 9001,
        exercisetosplit_id: 101,
        exercise_id: 1,
        workoutsplit_id: 11,
        exercise: 'Bench Press',
        workoutdate: '2026-03-27',
        order_index: 0,
        weight: [80, 85, 85],
        reps: [10, 8, 8],
        notes: null,
        exercisetoworkoutsplit: {
          sets: [10, 8, 8],
          exercises: {
            targetmuscle: 'Chest',
            specifictargetmuscle: 'Upper Chest',
          },
        },
      },
    ],
  },
};

const baseAnalyzedExerciseTrackingData: AnalysisContextAnalyzedExerciseTrackingData = {
  pr: {
    maxReps: 10,
    maxWeight: 85,
    maxExercise: 'Bench Press',
    maxDate: '2026-03-27',
  },
  workoutCount: 1,
  mostFrequentSplit: {
    splitName: 'A',
    times: 1,
  },
  lastWorkoutDate: '2026-03-27',
  splitDaysByName: {
    A: 1,
  },
};

const cloneUser = (): AppUser => ({
  ...baseUser,
});

const cloneWorkout = (): WholeUserWorkoutPlan => ({
  ...baseWorkout,
  workoutsplits:
    baseWorkout.workoutsplits?.map((split) => ({
      ...split,
      exercisetoworkoutsplit: split.exercisetoworkoutsplit.map((exercise) => ({
        ...exercise,
        sets: [...exercise.sets],
      })),
    })) ?? null,
});

const cloneWorkoutForEdit = (): WorkoutSplitsMap => ({
  A: baseWorkoutForEdit.A.map((exercise) => ({
    ...exercise,
    sets: [...exercise.sets],
  })),
  B: baseWorkoutForEdit.B.map((exercise) => ({
    ...exercise,
    sets: [...exercise.sets],
  })),
});

const cloneExerciseTrackingMaps = (): AnalysisContextExerciseTrackingMaps => ({
  byDate: {
    '2026-03-27': baseExerciseTrackingMaps.byDate['2026-03-27'].map((entry) => ({
      ...entry,
      weight: [...entry.weight],
      reps: [...entry.reps],
      exercisetoworkoutsplit: {
        ...entry.exercisetoworkoutsplit,
        sets: [...entry.exercisetoworkoutsplit.sets],
        exercises: {
          ...entry.exercisetoworkoutsplit.exercises,
        },
      },
    })),
  },
  byETSId: {
    101: baseExerciseTrackingMaps.byETSId[101].map((entry) => ({
      ...entry,
      weight: [...entry.weight],
      reps: [...entry.reps],
      exercisetoworkoutsplit: {
        ...entry.exercisetoworkoutsplit,
        sets: [...entry.exercisetoworkoutsplit.sets],
        exercises: {
          ...entry.exercisetoworkoutsplit.exercises,
        },
      },
    })),
  },
  bySplitName: {
    A: baseExerciseTrackingMaps.bySplitName.A.map((entry) => ({
      ...entry,
      weight: [...entry.weight],
      reps: [...entry.reps],
      exercisetoworkoutsplit: {
        ...entry.exercisetoworkoutsplit,
        sets: [...entry.exercisetoworkoutsplit.sets],
        exercises: {
          ...entry.exercisetoworkoutsplit.exercises,
        },
      },
    })),
  },
});

const cloneAnalyzedExerciseTrackingData = (): AnalysisContextAnalyzedExerciseTrackingData => ({
  pr: {
    ...baseAnalyzedExerciseTrackingData.pr,
  },
  workoutCount: baseAnalyzedExerciseTrackingData.workoutCount,
  mostFrequentSplit: {
    ...baseAnalyzedExerciseTrackingData.mostFrequentSplit,
  },
  lastWorkoutDate: baseAnalyzedExerciseTrackingData.lastWorkoutDate,
  splitDaysByName: {
    ...baseAnalyzedExerciseTrackingData.splitDaysByName,
  },
});

export const guestProfile: UserTestProfile = {
  key: 'guest',
  user: null,
  workout: null,
  workoutForEdit: null,
  exerciseTrackingMaps: null,
  analyzedExerciseTrackingData: null,
};

export const userWithoutWorkoutProfile: UserTestProfile = {
  key: 'userWithoutWorkout',
  user: cloneUser(),
  workout: null,
  workoutForEdit: null,
  exerciseTrackingMaps: null,
  analyzedExerciseTrackingData: null,
};

export const userWithWorkoutNoHistoryProfile: UserTestProfile = {
  key: 'userWithWorkoutNoHistory',
  user: cloneUser(),
  workout: cloneWorkout(),
  workoutForEdit: cloneWorkoutForEdit(),
  exerciseTrackingMaps: null,
  analyzedExerciseTrackingData: null,
};

export const userWithWorkoutAndHistoryProfile: UserTestProfile = {
  key: 'userWithWorkoutAndHistory',
  user: cloneUser(),
  workout: cloneWorkout(),
  workoutForEdit: cloneWorkoutForEdit(),
  exerciseTrackingMaps: cloneExerciseTrackingMaps(),
  analyzedExerciseTrackingData: cloneAnalyzedExerciseTrackingData(),
};

export const userProfiles = {
  guest: guestProfile,
  userWithoutWorkout: userWithoutWorkoutProfile,
  userWithWorkoutNoHistory: userWithWorkoutNoHistoryProfile,
  userWithWorkoutAndHistory: userWithWorkoutAndHistoryProfile,
} as const;
