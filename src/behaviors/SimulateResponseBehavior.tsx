import { useEffect, useRef } from "react";
import { BehaviorNodeProps } from "../types";

interface SimulateResponseBehaviorProps<T>
  extends BehaviorNodeProps<void, Error> {
  message: T;
  sendMessage: (message: T) => void;
  minDelay: number;
  maxDelay: number;
}

export default function SimulateResponseBehavior({
  message,
  sendMessage,
  onSuccess,
  onError,
  minDelay,
  maxDelay,
}: SimulateResponseBehaviorProps<string>) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const delay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

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
  }, [message, sendMessage, onSuccess, onError, minDelay, maxDelay]);

  return null;
}
