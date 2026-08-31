import useMyWorkoutPlan from './use-my-workout-plan.hook';

// Compatibility entry point for legacy components while MyWorkoutPlan uses the new hook directly.
export const useMyWorkoutPlanPageLogic = (): any => useMyWorkoutPlan();
export default useMyWorkoutPlanPageLogic;
