import { useState, useEffect } from 'react';
import { formatTime } from '../utils/formatTime';

export default function useTestTimer(initialTime) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !submitted) {
      alert("Time's Up! Test auto-submitted.");
      setSubmitted(true);
    }
  }, [timeLeft, submitted]);

  return { timeLeft, formatTime: () => formatTime(timeLeft), submitted };
}