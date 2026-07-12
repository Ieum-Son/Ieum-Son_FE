import { useEffect, useRef, useState } from "react";

export const useTimer = (initialTime = 180) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(initialTime);
    setIsExpired(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsExpired(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(
    2,
    "0",
  )}:${String(timeLeft % 60).padStart(2, "0")}`;

  return {
    formattedTime,
    isExpired,
    startTimer,
  };
};
