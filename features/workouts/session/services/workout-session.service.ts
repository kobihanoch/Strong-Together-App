import type { CreateWorkoutSessionBody } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';

export const saveWorkoutSession = async (workoutSession: CreateWorkoutSessionBody): Promise<void> => {
  await api.post('/api/workout-sessions', workoutSession);
};
