"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>(""); // Duration input
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time left for countdown
  const [isRunning, setIsRunning] = useState<boolean>(false); // Tracks timer state (running/paused)
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference
  const [promptVisible, setPromptVisible] = useState<boolean>(true); // State to manage prompt visibility

  // Set the countdown duration and reset the timer
  const handleSetDuration = (): void => {
    const validDuration = typeof duration === "number" && duration > 0;
    if (validDuration) {
      setTimeLeft(duration);
      setIsRunning(false); // Reset state when duration is set
      clearTimer();
      setPromptVisible(false); // Hide prompt once the duration is set
    }
  };

  // Start or resume the countdown
  const handleStart = (): void => {
    if (timeLeft > 0 && !isRunning) setIsRunning(true);
  };

  // Pause the countdown
  const handlePause = (): void => {
    if (isRunning) setIsRunning(false);
  };

  // Reset the countdown timer
  const handleReset = (): void => {
    setIsRunning(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    clearTimer();
    setPromptVisible(true); // Show prompt again after reset
  };

  // Clear the timer
  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Update the countdown timer each second
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return clearTimer; // Cleanup on unmount or state change
  }, [isRunning]);

  // Format the time into mm:ss
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Handle duration input changes
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || ""); // Ensure valid numeric input
  };

  // JSX rendering
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 w-full max-w-md transition-transform transform hover:scale-105">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-white text-center tracking-widest">
          Countdown Timer
        </h1>
        
        {/* Prompt to guide the user */}
        {promptVisible && (
          <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
            Please set a duration to start the countdown.
          </div>
        )}
        
        <div className="flex items-center mb-8">
          <Input
            type="number"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 p-3 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <Button
            onClick={handleSetDuration}
            className="ml-4 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 transition-all"
          >
            Set
          </Button>
        </div>
        <div className="text-6xl font-extrabold text-gray-800 dark:text-white mb-8 text-center bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleStart}
            className="bg-gradient-to-r from-green-400 to-lime-500 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-lime-500 hover:to-green-400 transition-all"
          >
            {isRunning ? "Running" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-400 transition-all"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-400 transition-all"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
