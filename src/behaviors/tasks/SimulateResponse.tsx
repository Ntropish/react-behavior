import React from "react";
import { BehaviorNodeProps } from "../../types";

interface SimulateResponseProps<T> extends BehaviorNodeProps<void, Error> {
  message: T;
  sendMessage: (message: T) => void;
  minDelay: number;
  maxDelay: number;
}

export default function SimulateResponse({
  message,
  sendMessage,
  onSuccess,
  onError,
  minDelay,
  maxDelay,
}: SimulateResponseProps<string>) {
  const timerRef = React.useRef<number | null>(null);

  // Generate a random delay between minDelay and maxDelay
  const [delay] = React.useState(
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
  );

  React.useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      try {
        sendMessage(message);
        onSuccess?.();
      } catch (e) {
        const error = e as Error;
        onError?.(error);
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [message, sendMessage, onSuccess, onError, minDelay, maxDelay, delay]);

  return null;
}
