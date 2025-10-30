export const getDaysSince = (lastDateString) => {
  if (!lastDateString) return "today";
  const lastDate = new Date(lastDateString);
  const today = new Date();

  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today - lastDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return "Today";
    case 1:
      return "Yesterday";
    default:
      if (diffDays < 30) {
        return `${diffDays} days ago`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} mo${months > 1 ? "s" : ""} ago`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} yr${years > 1 ? "s" : ""} ago`;
      }
  }
};

export const getBodyPartsForSplit = (split) => {
  if (!split || !split?.muscleGroup) return;
  const groups = split.muscleGroup
    .replace(/\s*\([^)]*\)/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // 3) Remove "Abs" (case-insensitive)
  const cleaned = groups.filter((g) => g.toLowerCase() !== "abs");

  // 4) Decide category:
  //    - Exactly ["Legs"] => "Lower Body"
  //    - Includes "Legs" with other muscles => "Full Body"
  //    - Otherwise => "Upper Body"
  const hasLegs = cleaned.some((g) => g.toLowerCase() === "legs");
  const onlyLegs = hasLegs && cleaned.length === 1;

  if (onlyLegs) return "Lower Body";
  if (hasLegs) return "Full Body";
  return "Upper Body";
};
