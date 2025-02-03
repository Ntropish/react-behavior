import { useState } from "react";
import { convertMessageToChatCompletionMessage, Message } from "../types";

import ChooseProcedureBehavior from "./ChooseProcedure";

interface GeorgeProps {
  username: string;
  sendMessage: (message: string) => void;
  messages: Message[];
}

export default function George({ sendMessage, messages }: GeorgeProps) {
  const [lastHandledMessageId, setLastHandledMessageId] = useState<
    string | null
  >(null);
  const latestUserMessageIndex = messages.findLastIndex(
    (message) => message.role === "user"
  );

  const lastHandledMessageIndex = messages.findLastIndex(
    (message) => message.id === lastHandledMessageId
  );

  if (lastHandledMessageIndex < latestUserMessageIndex) {
    const messagesTail = messages.slice(lastHandledMessageIndex + 1);
    return (
      <ChooseProcedureBehavior
        messages={messagesTail.map(convertMessageToChatCompletionMessage)}
        onError={(err: Error) => {
          setLastHandledMessageId(messages[latestUserMessageIndex].id);
          console.error(err);
          sendMessage("Sorry, I had an error.");
        }}
        onSuccess={() => {
          setLastHandledMessageId(messages[latestUserMessageIndex].id);
        }}
      />
    );
  }

  return null;
}
