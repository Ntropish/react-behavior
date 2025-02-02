import { TextField, IconButton, CircularProgress, Stack } from "@mui/material";

import { useState } from "react";

import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setIsLoading(true);
    onSendMessage(message);
    setMessage("");
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          flex: 0,
          position: "relative",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          disabled={isLoading}
        />
        <IconButton
          color="primary"
          type="submit"
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Stack>
    </form>
  );
}
