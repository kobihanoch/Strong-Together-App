import { GetWorkoutSchedulesResponse } from '@strong-together/shared';

export type WorkoutSchedules = GetWorkoutSchedulesResponse;
export type WorkoutSchedulesItem = WorkoutSchedules['schedules'][number];
