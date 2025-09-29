export const getDaysSince = (lastDateString) => {
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

export const safeParseFloat = (val) => {
  if (!val) return undefined;
  const cleaned = val.replace(",", ".");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : undefined;
};
