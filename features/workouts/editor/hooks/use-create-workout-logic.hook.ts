import useEditWorkoutPlan from './use-edit-workout-plan.hook';

// Compatibility entry point for legacy tests/components while the screen uses the new hook directly.
const useCreateWorkoutLogic = (): any => useEditWorkoutPlan();

export default useCreateWorkoutLogic;
