import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text } from "react-native";

const Timer = forwardRef(({ style, startTime = null }, ref) => {
  const startAtRef = useRef(startTime || Date.now());
  const intervalRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const pausedRef = useRef(false);
  const pauseStartRef = useRef(null);
  const pausedTimeInSecRef = useRef(0);

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
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const seconds =
        Math.floor((now - startAtRef.current) / 1000) -
        pausedTimeInSecRef.current;

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

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <Text style={style}>
      {mm}:{ss}
    </Text>
  );
});

export default Timer;
