import { useState, useCallback } from "react";

import { Stack, Typography } from "@mui/material";
import ChatMessagesDisplay from "../components/ChatMessagesDisplay";
import ChatInput from "../components/ChatInput";
import George from "../agents/George";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      content: "Hello, how can I help you?",
      role: "assistant",
      authorName: "George",
      timestamp: new Date().toISOString(),
      id: "1",
    },
  ]);

  const handleSendMessage = useCallback((content: string) => {
    const newMessage = {
      content,
      role: "user",
      authorName: "User",
      timestamp: new Date().toISOString(),
      id: `${Date.now()}`,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const handleAssistantSendMessage = useCallback((content: string) => {
    const newMessage = {
      content,
      role: "assistant",
      authorName: "George",
      timestamp: new Date().toISOString(),
      id: `${Date.now()}`,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={{
        flex: 1,
        minHeight: 0,
        py: 1,
      }}
    >
      <Typography variant="h4" color="text.secondary">
        Home
      </Typography>

      <George
        username="assistant"
        sendMessage={handleAssistantSendMessage}
        messages={messages}
      />

      <ChatMessagesDisplay messages={messages} />

      <ChatInput onSendMessage={handleSendMessage} />
    </Stack>
  );
}
