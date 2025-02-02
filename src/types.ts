import * as z from "zod";

export const messageSchema = z.object({
  text: z.string(),
  author: z.string(),
  timestamp: z.string(),
  id: z.string(),
});

export type Message = z.infer<typeof messageSchema>;
