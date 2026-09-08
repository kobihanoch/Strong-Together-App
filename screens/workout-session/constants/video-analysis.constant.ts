export const EXERCISE_ANALYSIS_CATALOG = {
  squat: ['squat', 'smith machine squat'],
} satisfies Record<string, readonly string[]>;

type SupportedAnalysisExercise = keyof typeof EXERCISE_ANALYSIS_CATALOG;

const normalizeLabel = (label: string | null | undefined) => label?.trim().toLowerCase() ?? '';

export const getSupportedAnalysisExerciseName = (
  exerciseName: string | null | undefined,
): SupportedAnalysisExercise | null => {
  const normalized = normalizeLabel(exerciseName);

  const match = Object.entries(EXERCISE_ANALYSIS_CATALOG).find(([, aliases]) => aliases.includes(normalized));
  return (match?.[0] as SupportedAnalysisExercise | undefined) ?? null;
};

export const isExerciseAnalysisSupported = (exerciseName: string | null | undefined) =>
  getSupportedAnalysisExerciseName(exerciseName) !== null;
