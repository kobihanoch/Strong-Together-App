import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

export interface TimerRef {
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

interface TimerProps {
  style?: StyleProp<TextStyle>;
  startTime?: number | null;
  pausedTotal?: number;
}

const Timer = forwardRef<TimerRef, TimerProps>(({ style, startTime = null, pausedTotal = 0 }, ref) => {
  const startAtRef = useRef<number>(startTime || Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const pausedRef = useRef<boolean>(false);
  const pauseStartRef = useRef<number | null>(null);
  const pausedTimeInSecRef = useRef<number>((pausedTotal || 0) / 1000);

  useImperativeHandle(ref, () => ({
    pause: () => {
      if (!pausedRef.current) {
        pausedRef.current = true;
        pauseStartRef.current = Date.now();
      }
    },
    resume: () => {
      if (pausedRef.current && pauseStartRef.current) {
        const pausedDelta = Date.now() - pauseStartRef.current;
        pausedTimeInSecRef.current += Math.floor(pausedDelta / 1000);
        pauseStartRef.current = null;
        pausedRef.current = false;
      }
    },
    reset: () => {
      startAtRef.current = Date.now();
      pausedRef.current = false;
      pauseStartRef.current = null;
      pausedTimeInSecRef.current = 0;
      setElapsed(0);
    },
  }));

  useEffect(() => {
    if (startTime) startAtRef.current = startTime;
    pausedTimeInSecRef.current = Math.floor((pausedTotal || 0) / 1000);

    const now = Date.now();
    const seconds = Math.floor((now - startAtRef.current) / 1000) - pausedTimeInSecRef.current;

    setElapsed(seconds < 0 ? 0 : seconds);
  }, [startTime, pausedTotal]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - startAtRef.current) / 1000) - pausedTimeInSecRef.current;

      // Only update when not paused
      if (!pausedRef.current) {
        setElapsed((prev) => (prev !== seconds ? seconds : prev));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <Text style={style}>
      {mm}:{ss}
    </Text>
  );
});

Timer.displayName = 'Timer';
export default Timer;
