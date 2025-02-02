import { useState } from "react";
import { Message } from "../types";
import RespondGracefullyBehavior from "../behaviors/RespondGracefullyBehavior";

interface GeorgeProps {
  username: string;
  sendMessage: (message: string) => void;
  messages: Message[];
}

export default function George({
  username,
  sendMessage,
  messages,
}: GeorgeProps) {
  const [lastHandledMessageId, setLastHandledMessageId] = useState<
    string | null
  >(null);
  const latestUserMessageIndex = messages.findLastIndex(
    (message) => message.author === "user"
  );

  const lastHandledMessageIndex = messages.findLastIndex(
    (message) => message.id === lastHandledMessageId
  );

  console.log({ latestUserMessageIndex, lastHandledMessageIndex });

  if (lastHandledMessageIndex < latestUserMessageIndex) {
    return (
      <RespondGracefullyBehavior
        key={latestUserMessageIndex}
        sendMessage={(message) => sendMessage(message)}
        onSuccess={() => {
          setLastHandledMessageId(messages[latestUserMessageIndex].id);
        }}
        onError={(err: any) => {
          setLastHandledMessageId(messages[latestUserMessageIndex].id);
          console.error(err);
          sendMessage("Sorry, I had an error.");
        }}
      />
    );
  }

  return null;
}
