import { Box, Divider, Stack, Typography } from "@mui/material";

import { formatDistanceToNow } from "date-fns";

interface ChatMessagesDisplayProps {
  userName?: string;
  messages: {
    text: string;
    author: string;
    timestamp: string;
    id: string;
  }[];
}

export default function ChatMessagesDisplay({
  messages,
  userName = "user",
}: ChatMessagesDisplayProps) {
  return (
    <Stack
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
