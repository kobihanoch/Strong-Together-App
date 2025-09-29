import { showErrorAlert } from "../errors/errorAlerts";

export const addExerciseLogic = (prev, splitName, exercise) => {
  const splitExercises = prev[splitName] ?? [];
  const exWithOrderIndex = {
    ...exercise,
    sets: [10, 10, 10],
    order_index: splitExercises.length,
  };
  const isExExists = splitExercises.some((ex) => ex.id === exercise.id);
  if (!isExExists) {
    const updatedSplitExercises = [...splitExercises, exWithOrderIndex];
    return { ...prev, [splitName]: updatedSplitExercises };
  }
  return prev;
};

export const removeExerciseLogic = (prev, splitName, exercise) => {
  const splitExercises = prev[splitName] ?? [];
  const isExExists = splitExercises.some((ex) => ex.id === exercise.id);
  if (isExExists) {
    const updatedSplitExercises = splitExercises.filter(
      (ex) => ex.id !== exercise.id
    );
    return {
      ...prev,
      [splitName]: reindexExercises(updatedSplitExercises),
    };
  }
  return prev;
};

export const updateSetsLogic = (prev, splitName, exercise, updatedSetsArr) => {
  const splitExercises = prev[splitName] ?? [];
  const isExExists = splitExercises.some((ex) => ex.id === exercise.id);
  if (isExExists) {
    const updatedSplitExercises = splitExercises.map((ex) =>
      ex.id === exercise.id ? { ...ex, sets: updatedSetsArr } : ex
    );
    return {
      ...prev,
      [splitName]: updatedSplitExercises,
    };
  }
  return prev;
};

export const addSplitLogic = (prev) => {
  const splitsList = Object.keys(prev);

  if (splitsList.length >= 6) {
    showErrorAlert("Error", "Max splits allowed is 6");
    return { next: prev, lastAdded: null, didAdd: false };
  }

  const splitName = getNextSplitNameFromObj(prev);

  if (prev[splitName]) {
    return { next: prev, lastAdded: null, didAdd: false };
  }
  return {
    next: { ...prev, [splitName]: [] },
    lastAdded: splitName,
    didAdd: true,
  };
};

// Next name based on existing object keys (A..Z). Assumes keys are single uppercase letters.
const getNextSplitNameFromObj = (obj) => {
  const keys = Object.keys(obj).sort(); // e.g., ["A", "B", "C"]
  if (keys.length === 0) return "A";
  const last = keys.at(-1);
  const nextCharCode = last.charCodeAt(0) + 1;
  if (nextCharCode > 90) return null; // 'Z' overflow
  return String.fromCharCode(nextCharCode); // e.g., "D"
};

export const reindexExercises = (arr) => {
  return arr.map((ex, i) => {
    // If order_index is already correct, keep the same object reference
    if (ex.order_index === i) return ex;
    // Otherwise create a new object only for the changed one
    return { ...ex, order_index: i };
  });
};

export const onDragEndLogic = (prev, splitName, data) => {
  // return new state (immutable!)
  return { ...prev, [splitName]: reindexExercises(data) };
};

export const removeSplitLogic = (prev, splitName) => {
  const copy = { ...prev };
  const splitNames = Object.keys(copy);
  const indexToRemove = splitNames.indexOf(splitName);

  delete copy[splitName];

  // If nothing left → reset to default
  if (Object.keys(copy).length === 0) {
    return {
      next: { A: [] },
      nextSelected: "A",
    };
  }

  // Normalize keys to A, B, C...
  const normalized = normalizeSplitKeys(copy);
  const newKeys = Object.keys(normalized);

  let nextSelected;

  if (indexToRemove < newKeys.length) {
    // There is a right neighbor at the same index (after deletion)
    nextSelected = newKeys[indexToRemove];
  } else {
    // Removed the last → fallback to last available
    nextSelected = newKeys[newKeys.length - 1];
  }

  return {
    next: normalized,
    nextSelected,
  };
};

export const moveItem = (arr, from, to) => {
  const copy = arr.slice();
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
};

const normalizeSplitKeys = (obj) => {
  const keys = Object.keys(obj).sort(); // ensure deterministic order: A,B,C,...
  const out = {};
  keys.forEach((oldKey, idx) => {
    const newKey = String.fromCharCode(65 + idx); // 65 === 'A'
    out[newKey] = obj[oldKey]; // keep the same exercises array
  });
  return out;
};

export const getExercisesCountMap = (selectedExercises) => {
  let sum = 0;
  const map = Object.entries(selectedExercises).reduce(
    (acc, [split, exercises]) => {
      sum += exercises.length;
      acc[split] = exercises.length;
      return acc;
    },
    {}
  );
  return { totalExercises: sum, map };
};
