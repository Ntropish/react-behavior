import { useEffect } from "react";
import { Message } from "../types";

interface GeorgeProps {
  username: string;
  sendMessage: (message: string) => void;
  messages: Message[];
}

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

export default function George({
  username,
  sendMessage,
  messages,
}: GeorgeProps) {
  // respond to other people's messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage && lastMessage.author !== username) {
      setTimeout(() => {
        sendMessage(
          randomResponses[Math.floor(Math.random() * randomResponses.length)]
        );
      }, 1000);
    }
  }, [messages, sendMessage, username]);

  return null;
}
