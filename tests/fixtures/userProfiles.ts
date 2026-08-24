import type { WorkoutHistoryAnalyzedExerciseTrackingData, WorkoutHistoryExerciseTrackingMaps, } from '../../features/workouts/history/types/workout-history.types';
import type {
  CardioDailyMap, CardioWeeklyMap, } from '../../features/workouts/cardio/types/cardio.types';
import type { UserMessages } from '../../features/messages/types/messages.types';
import type { AppUser } from '../../features/auth/shared/types/auth.types';
import type { WorkoutPlan, WorkoutPlanForEdit } from '../../features/workouts/plan/types/workout-plan.types';

export interface UserTestProfile {
  key: 'guest' | 'userWithoutWorkout' | 'userWithWorkoutNoHistory' | 'userWithWorkoutAndHistory';
  user: AppUser | null;
  workout: WorkoutPlan | null;
  workoutForEdit: WorkoutPlanForEdit | null;
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | null;
  analyzedExerciseTrackingData: WorkoutHistoryAnalyzedExerciseTrackingData | null;
  cardioDailyMap: CardioDailyMap | null;
  cardioWeeklyMap: CardioWeeklyMap | null;
  notificationMessages: UserMessages;
}

const baseUser: AppUser = {
  id: 'user-1',
  username: 'johnny',
  email: 'john@example.com',
  name: 'John Doe',
  gender: 'Male',
  createdAt: '2026-03-25T10:00:00.000Z',
  updatedAt: '2026-03-25T10:00:00.000Z',
  profilePicPath: null,
  pushToken: null,
  role: 'user',
  isFirstLogin: false,
  tokenVersion: 1,
  isVerified: true,
  authProvider: 'email',
  lastLogin: null,
};

const baseWorkout: WorkoutPlan = {
  id: 7,
  numberOfSplits: 2,
  createdAt: '2026-03-20T08:00:00.000Z',
  userId: 'user-1',
  isActive: true,
  updatedAt: '2026-03-26T08:00:00.000Z',
  workoutSplits: [
    {
      id: 11,
      name: 'A',
      workoutId: 7,
      createdAt: '2026-03-20T08:00:00.000Z',
      isActive: true,
      muscleGroup: 'Chest(Major)',
      exerciseToWorkoutSplit: [
        {
          id: 20,
          sets: [10, 8, 8],
          isActive: true,
          targetMuscle: 'Chest',
          specificTargetMuscle: 'Major',
          exercise: 'Bench Press',
          workoutSplit: 'A',
        },
      ],
    },
    {
      id: 12,
      name: 'B',
      workoutId: 7,
      createdAt: '2026-03-20T08:00:00.000Z',
      isActive: true,
      muscleGroup: 'Back(Lats)',
      exerciseToWorkoutSplit: [
        {
          id: 21,
          sets: [12, 12, 10],
          isActive: true,
          targetMuscle: 'Back',
          specificTargetMuscle: 'Lats',
          exercise: 'Lat Pulldown',
          workoutSplit: 'B',
        },
      ],
    },
  ],
};

const baseWorkoutForEdit: WorkoutPlanForEdit = {
  A: [
    {
      id: 1,
      name: 'Bench Press',
      sets: [10, 8, 8],
      orderIndex: 0,
      targetMuscle: 'Chest',
      specificTargetMuscle: 'Major',
    },
  ],
  B: [
    {
      id: 2,
      name: 'Lat Pulldown',
      sets: [12, 12, 10],
      orderIndex: 0,
      targetMuscle: 'Back',
      specificTargetMuscle: 'Lats',
    },
  ],
};

const baseExerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps = {
  byDate: {
    '2026-03-27': [
      {
        id: 9001,
        exerciseToSplitId: 101,
        exerciseId: 1,
        workoutSplitId: 11,
        splitName: 'A',
        exercise: 'Bench Press',
        orderIndex: 0,
        weight: [80, 85, 85],
        reps: [10, 8, 8],
        notes: null,
        exerciseToWorkoutSplit: {
          sets: [10, 8, 8],
          exercises: {
            targetMuscle: 'Chest',
            specificTargetMuscle: 'Upper Chest',
          },
        },
      },
    ],
  },
  byExerciseToSplitId: {
    101: [
      {
        id: 9001,
        exerciseToSplitId: 101,
        exerciseId: 1,
        workoutSplitId: 11,
        splitName: 'A',
        exercise: 'Bench Press',
        workoutDate: '2026-03-27',
        orderIndex: 0,
        weight: [80, 85, 85],
        reps: [10, 8, 8],
        notes: null,
        exerciseToWorkoutSplit: {
          sets: [10, 8, 8],
          exercises: {
            targetMuscle: 'Chest',
            specificTargetMuscle: 'Upper Chest',
          },
        },
      },
    ],
  },
  bySplitName: {
    A: [
      {
        id: 9001,
        exerciseToSplitId: 101,
        exerciseId: 1,
        workoutSplitId: 11,
        exercise: 'Bench Press',
        workoutDate: '2026-03-27',
        orderIndex: 0,
        weight: [80, 85, 85],
        reps: [10, 8, 8],
        notes: null,
        exerciseToWorkoutSplit: {
          sets: [10, 8, 8],
          exercises: {
            targetMuscle: 'Chest',
            specificTargetMuscle: 'Upper Chest',
          },
        },
      },
    ],
  },
};

const emptyExerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps = {
  byDate: {},
  byExerciseToSplitId: {},
  bySplitName: {},
};

const baseAnalyzedExerciseTrackingData: WorkoutHistoryAnalyzedExerciseTrackingData = {
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

const emptyCardioDailyMap: CardioDailyMap = {};

const baseCardioDailyMap: CardioDailyMap = {
  '2026-03-27': [
    {
      type: 'Run',
      durationMins: 25,
      durationSec: 30,
    },
  ],
};

const emptyCardioWeeklyMap: CardioWeeklyMap = {};

const baseCardioWeeklyMap: CardioWeeklyMap = {
  '2026-03-23': {
    records: [
      {
        type: 'Run',
        durationMins: 25,
        durationSec: 30,
        workoutTimeUtc: '2026-03-27T06:00:00.000Z',
      },
    ],
    totalDurationMins: 25,
    totalDurationSec: 30,
  },
};

const emptyNotificationMessages: UserMessages = [];

const baseNotificationMessages: UserMessages = [
  {
    id: 'msg-1',
    subject: 'Workout reminder',
    msg: 'Time to train today.',
    sentAt: '2026-03-27T08:00:00.000Z',
    isRead: false,
    senderFullName: 'Coach Mike',
    senderProfilePicPath: 'profiles/coach-mike.png',
  },
  {
    id: 'msg-2',
    subject: 'Great job',
    msg: 'You hit a new PR this week.',
    sentAt: '2026-03-26T12:00:00.000Z',
    isRead: true,
    senderFullName: 'Coach Mike',
    senderProfilePicPath: 'profiles/coach-mike.png',
  },
];

const cloneUser = (): AppUser => ({
  ...baseUser,
});

const cloneWorkout = (): WorkoutPlan => ({
  ...baseWorkout,
  workoutSplits:
    baseWorkout.workoutSplits?.map((split) => ({
      ...split,
      exerciseToWorkoutSplit: split.exerciseToWorkoutSplit.map((exercise) => ({
        ...exercise,
        sets: [...exercise.sets],
      })),
    })) ?? null,
});

const cloneWorkoutForEdit = (): WorkoutPlanForEdit => ({
  A: baseWorkoutForEdit.A.map((exercise) => ({
    ...exercise,
    sets: [...exercise.sets],
  })),
  B: baseWorkoutForEdit.B.map((exercise) => ({
    ...exercise,
    sets: [...exercise.sets],
  })),
});

const cloneExerciseTrackingMaps = (): WorkoutHistoryExerciseTrackingMaps => ({
  byDate: {
    '2026-03-27': baseExerciseTrackingMaps.byDate['2026-03-27'].map((entry) => ({
      ...entry,
      weight: [...entry.weight],
      reps: [...entry.reps],
      exerciseToWorkoutSplit: {
        ...entry.exerciseToWorkoutSplit,
        sets: [...entry.exerciseToWorkoutSplit.sets],
        exercises: {
          ...entry.exerciseToWorkoutSplit.exercises,
        },
      },
    })),
  },
  byExerciseToSplitId: {
    101: baseExerciseTrackingMaps.byExerciseToSplitId[101].map((entry) => ({
      ...entry,
      weight: [...entry.weight],
      reps: [...entry.reps],
      exerciseToWorkoutSplit: {
        ...entry.exerciseToWorkoutSplit,
        sets: [...entry.exerciseToWorkoutSplit.sets],
        exercises: {
          ...entry.exerciseToWorkoutSplit.exercises,
        },
      },
    })),
  },
  bySplitName: {
    A: baseExerciseTrackingMaps.bySplitName.A.map((entry) => ({
      ...entry,
      weight: [...entry.weight],
      reps: [...entry.reps],
      exerciseToWorkoutSplit: {
        ...entry.exerciseToWorkoutSplit,
        sets: [...entry.exerciseToWorkoutSplit.sets],
        exercises: {
          ...entry.exerciseToWorkoutSplit.exercises,
        },
      },
    })),
  },
});

const cloneAnalyzedExerciseTrackingData = (): WorkoutHistoryAnalyzedExerciseTrackingData => ({
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

const cloneCardioDailyMap = (): CardioDailyMap => ({
  '2026-03-27': baseCardioDailyMap['2026-03-27'].map((record) => ({
    ...record,
  })),
});

const cloneCardioWeeklyMap = (): CardioWeeklyMap => ({
  '2026-03-23': {
    ...baseCardioWeeklyMap['2026-03-23'],
    records: baseCardioWeeklyMap['2026-03-23'].records.map((record) => ({
      ...record,
    })),
  },
});

const cloneNotificationMessages = (): UserMessages =>
  baseNotificationMessages.map((message: UserMessages[number]) => ({
    ...message,
  }));

export const guestProfile: UserTestProfile = {
  key: 'guest',
  user: null,
  workout: null,
  workoutForEdit: null,
  exerciseTrackingMaps: null,
  analyzedExerciseTrackingData: null,
  cardioDailyMap: null,
  cardioWeeklyMap: null,
  notificationMessages: [],
};

export const userWithoutWorkoutProfile: UserTestProfile = {
  key: 'userWithoutWorkout',
  user: cloneUser(),
  workout: null,
  workoutForEdit: null,
  exerciseTrackingMaps: {
    ...emptyExerciseTrackingMaps,
  },
  analyzedExerciseTrackingData: null,
  cardioDailyMap: {
    ...emptyCardioDailyMap,
  },
  cardioWeeklyMap: {
    ...emptyCardioWeeklyMap,
  },
  notificationMessages: [...emptyNotificationMessages],
};

export const userWithWorkoutNoHistoryProfile: UserTestProfile = {
  key: 'userWithWorkoutNoHistory',
  user: cloneUser(),
  workout: cloneWorkout(),
  workoutForEdit: cloneWorkoutForEdit(),
  exerciseTrackingMaps: {
    ...emptyExerciseTrackingMaps,
  },
  analyzedExerciseTrackingData: null,
  cardioDailyMap: {
    ...emptyCardioDailyMap,
  },
  cardioWeeklyMap: {
    ...emptyCardioWeeklyMap,
  },
  notificationMessages: [...emptyNotificationMessages],
};

export const userWithWorkoutAndHistoryProfile: UserTestProfile = {
  key: 'userWithWorkoutAndHistory',
  user: cloneUser(),
  workout: cloneWorkout(),
  workoutForEdit: cloneWorkoutForEdit(),
  exerciseTrackingMaps: cloneExerciseTrackingMaps(),
  analyzedExerciseTrackingData: cloneAnalyzedExerciseTrackingData(),
  cardioDailyMap: cloneCardioDailyMap(),
  cardioWeeklyMap: cloneCardioWeeklyMap(),
  notificationMessages: cloneNotificationMessages(),
};

export const userProfiles = {
  guest: guestProfile,
  userWithoutWorkout: userWithoutWorkoutProfile,
  userWithWorkoutNoHistory: userWithWorkoutNoHistoryProfile,
  userWithWorkoutAndHistory: userWithWorkoutAndHistoryProfile,
} as const;
