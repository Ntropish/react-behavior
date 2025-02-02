import { useState, useCallback } from "react";

import { Stack, Typography } from "@mui/material";
import ChatMessagesDisplay from "../components/ChatMessagesDisplay";
import ChatInput from "../components/ChatInput";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      text: "Hello, how can I help you?",
      author: "assistant",
      timestamp: new Date().toISOString(),
      id: "1",
    },
  ]);

  const handleSendMessage = useCallback((text: string) => {
    const newMessage = {
      text,
      author: "user",
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

      <ChatMessagesDisplay messages={messages} />

      <ChatInput onSendMessage={handleSendMessage} />
    </Stack>
  );
}
