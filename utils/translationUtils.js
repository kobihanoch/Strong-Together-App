export const slug = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .replace(/[().]/g, "") // remove dots and parentheses
    .replace(/[^a-z0-9]+/g, "_") // normalize anything non-alnum
    .replace(/^_+|_+$/g, ""); // trim underscores

// Translate exercise name from DB with fallback
export const tExercise = (t, name) =>
  t(`exercise.type.${slug(name)}`, { defaultValue: name });

// Translate muscle name from DB with fallback
export const tMuscle = (t, name) =>
  t(`muscles.${slug(name)}`, { defaultValue: name });

// Remove any parenthetical groups like "Back (Lats)" -> "Back"
export const stripParentheses = (s) => (s || "").replace(/\s*\([^)]*\)/g, "");

// Split a comma-separated muscle string to main muscles only (unique, trimmed)
export const splitMainMuscles = (s) => {
  const cleaned = stripParentheses(s);
  return cleaned
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i); // keep unique while preserving order
};

// Localize a whole muscle list using tMuscle and join nicely
export const localizeMuscleList = (t, s) =>
  splitMainMuscles(s)
    .map((m) => tMuscle(t, m))
    .join(", ");
