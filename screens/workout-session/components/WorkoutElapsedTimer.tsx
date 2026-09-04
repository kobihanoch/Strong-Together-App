import React, { useEffect, useState } from 'react';
import { Text, type TextStyle } from 'react-native';

type Props = { startedAtUtc: string | null; style?: TextStyle };

const formatElapsed = (startedAtUtc: string | null): string => {
  if (!startedAtUtc) return '00:00';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(startedAtUtc).getTime()) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return hours
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

/** Derives elapsed workout time from the cached start timestamp. */
const WorkoutElapsedTimer = ({ startedAtUtc, style }: Props) => {
  const [value, setValue] = useState(() => formatElapsed(startedAtUtc));

  useEffect(() => {
    setValue(formatElapsed(startedAtUtc));
    const interval = setInterval(() => setValue(formatElapsed(startedAtUtc)), 1000);
    return () => clearInterval(interval);
  }, [startedAtUtc]);

  return <Text style={style}>{value}</Text>;
};

export default WorkoutElapsedTimer;
