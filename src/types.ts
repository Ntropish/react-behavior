import * as z from "zod";

export const messageSchema = z.object({
  text: z.string(),
  author: z.string(),
  timestamp: z.string(),
  id: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export interface BehaviorNodeProps<T = unknown, E = Error> {
  onSuccess: (response?: T) => void;
  onError: (error?: E) => void;
}

export type BehaviorNodeRenderer = (
  props: BehaviorNodeProps
) => React.ReactElement;
