import { useState } from "react";

import randomItemFromArray from "../../util/randomItemFromArray";
import { BehaviorNodeProps } from "../../types";
import SequenceDecorator from "../decorators/Sequence";
import SimulateResponse from "../tasks/SimulateResponse";

const randomInitialResponses = [
  "Got it! Let me think about it for a moment.",
  "That's a good question. Let me ponder that for a bit.",
  "Hmm, let me gather my thoughts on that.",
  "Let me take a moment to consider that.",
  "Let me reflect on that for a moment.",
  "Let me think about that for a moment.",
  "Let me take a moment to reflect on that.",
  "Let me gather my thoughts on that for a moment.",
  "Let me take a moment to think about that.",
  "That is a thought-provoking question. Let me think about it for a moment.",
  "That's a complex question. Let me think about it for a moment.",
  "That's a challenge. Let me think about it for a moment.",
];

const randomResponses = [
  "I'm not sure how to respond to that.",
  "Can you please clarify?",
  "I don't have an answer for that right now.",
  "That's an interesting question.",
  "I'm still learning about that topic.",
  "I need more information to provide a good answer.",
  "That's outside my current knowledge base.",
  "I can't help you with that.",
  "I'm not programmed to answer that question.",
  "I don't have enough context to respond.",
];

interface RespondGracefullyBehaviorProps
  extends BehaviorNodeProps<void, Error> {
  sendMessage: (message: string) => void;
}

export default function RespondGracefullyBehavior({
  sendMessage,
  onSuccess: handleSuccess,
  onError: handleError,
}: RespondGracefullyBehaviorProps) {
  const [initialResponse] = useState(
    randomItemFromArray(randomInitialResponses)
  );
  const [secondResponse] = useState(randomItemFromArray(randomResponses));

  return (
    <SequenceDecorator
      onSuccess={() => handleSuccess?.()}
      onError={() => handleError?.(new Error("Sequence failed"))}
    >
      {(injectedProps: BehaviorNodeProps) => (
        <SimulateResponse
          {...injectedProps}
          minDelay={200}
          maxDelay={1000}
          message={initialResponse}
          sendMessage={sendMessage}
        />
      )}
      {(injectedProps: BehaviorNodeProps) => (
        <SimulateResponse
          {...injectedProps}
          minDelay={5000}
          maxDelay={10000}
          message={secondResponse}
          sendMessage={sendMessage}
        />
      )}
    </SequenceDecorator>
  );
}
