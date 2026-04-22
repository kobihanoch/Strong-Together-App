export const getDaysSince = (lastDateString: string) => {
  const lastDate = new Date(lastDateString);
  const today = new Date();

  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
    default:
      if (diffDays < 30) {
        return `${diffDays} days ago`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} mo${months > 1 ? 's' : ''} ago`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} yr${years > 1 ? 's' : ''} ago`;
      }
  }
};

export const safeParseFloat = (val: string) => {
  if (!val) return undefined;
  const cleaned = val.replace(',', '.');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : undefined;
};

export const ymdInCurrentTZ = (ms: number) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(ms)); // e.g., "2025-10-26"
};

// Format a date string (YYYY-MM-DD) into "Mon DD, YYYY"
export const formatDate = (dateToFormat: string) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let year, month, day;

  // Handle both "YYYY-MM-DD" strings and Date objects
  if (typeof dateToFormat === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateToFormat)) {
    // Parse manually to avoid timezone issues
    [year, month, day] = dateToFormat.split('-').map((part) => parseInt(part, 10));
    // month is 1-based, convert to 0-based
    month = month - 1;
  } else {
    const dateObj = new Date(dateToFormat);
    year = dateObj.getFullYear();
    month = dateObj.getMonth();
    day = dateObj.getDate();
  }

  const monthName = monthNames[month];
  return `${monthName} ${day}, ${year}`;
};

// Format time into HRS hrs MINUTES mins SECONDS secs
export const formatTime = (min: number = 0, sec: number = 0) => {
  if (!min && !sec) return 'None';
  else {
    const hrs = Math.floor(min / 60);
    const mins = min - hrs * 60;
    const hrsText = hrs > 0 ? (hrs == 1 ? hrs + ' hr' : hrs + ' hrs') : null;
    const minText = mins > 0 ? (mins == 1 ? mins + ' min' : mins + ' mins') : null;
    const secText = hrs < 1 ? (sec > 0 ? (sec == 1 ? sec + ' sec' : sec + ' secs') : null) : null;
    return [hrsText, minText, secText].filter(Boolean).join(' ');
  }
};
