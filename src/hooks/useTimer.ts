import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = (initialTime = 180) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialTimeRef = useRef(initialTime);

  initialTimeRef.current = initialTime;

  const clear = useCallback(() => {
    if (!timerRef.current) return;

    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = useCallback(
    (seconds?: number) => {
      clear();
      setTimeLeft(seconds ?? initialTimeRef.current);
      setIsExpired(false);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clear();
            setIsExpired(true);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    },
    [clear],
  );

  const stopTimer = useCallback(() => clear(), [clear]);

  useEffect(() => clear, [clear]);

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(
    2,
    "0",
  )}:${String(timeLeft % 60).padStart(2, "0")}`;

  return {
    timeLeft,
    formattedTime,
    isExpired,
    startTimer,
    stopTimer,
  };
};
