import { useEffect, useRef } from "react";

import { Box, Divider, Stack, Typography } from "@mui/material";

import { Message } from "../types";

interface ChatMessagesDisplayProps {
  userName?: string;
  messages: Message[];
}

export default function ChatMessagesDisplay({
  messages,
  userName = "user",
}: ChatMessagesDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // We'll assume the chat is at the bottom initially.
  const wasAtBottomRef = useRef(true);

  // Listen to scroll events to keep track if we're near the bottom.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container;
      // Tolerance of 10px to consider as "at bottom"
      wasAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 10;
    };

    container.addEventListener("scroll", handleScroll);
    // Run it once on mount.
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // When new messages come in, scroll to bottom if we were already at the bottom.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (wasAtBottomRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // When new messages come in from userName, scroll to bottom.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.author === userName) {
      const container = containerRef.current;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, userName]);

  return (
    <Stack
      ref={containerRef}
      direction="column"
      spacing={0.2}
      sx={{
        flex: 1,
        minHeight: 0,
        my: 0.2,
        overflowY: "auto",
        scrollbarGutter: "stable",
        pr: 1,
      }}
    >
      {messages.map((message, index) => (
        <Box key={message.id}>
          <Stack
            direction="row"
            spacing={0.2}
            alignItems="flex-start"
            sx={{ mb: 0.4 }}
            justifyContent={
              message.author === userName ? "flex-end" : "flex-start"
            }
          >
            <Stack
              direction="column"
              spacing={0.2}
              sx={{
                maxWidth: "70%",
                alignItems:
                  message.author === userName ? "flex-end" : "flex-start",
              }}
            >
              <Typography variant="body1" color="text.primary">
                {message.text}
              </Typography>
            </Stack>
          </Stack>
          {index !== messages.length - 1 &&
            message.author !== messages[index + 1].author && (
              <Divider sx={{ my: 1 }} />
            )}
        </Box>
      ))}
    </Stack>
  );
}
