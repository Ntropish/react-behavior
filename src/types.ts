import * as z from "zod";

export const messageSchema = z.object({
  content: z.string(),
  role: z.string(),
  authorName: z.string(),
  timestamp: z.string(),
  id: z.string(),
});

export type Message = z.infer<typeof messageSchema>;

export interface BehaviorNodeProps<T = unknown, E = unknown> {
  onSuccess: (response: T) => void;
  onError: (error: E) => void;
}

export type BehaviorNodeRenderer = (
  props: BehaviorNodeProps
) => React.ReactElement;

// "messages": [{"role": "user", "content": "What dell products do you have under $50 in electronics?"}],

export const chatCompletionMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export type ChatCompletionMessage = z.infer<typeof chatCompletionMessageSchema>;

export function convertMessageToChatCompletionMessage(
  message: Message
): ChatCompletionMessage {
  return {
    role:
      message.role === "assistant"
        ? "assistant"
        : message.role === "system"
        ? "system"
        : "user",
    content: message.content,
  };
}

// properties defintions
export const stringPropertySchema = z.object({
  type: z.literal("string"),
  description: z.string(),
  enum: z.array(z.string()).optional(),
});

export const numberPropertySchema = z.object({
  type: z.literal("number"),
  description: z.string(),
});

export const toolSchema = z.object({
  type: z.enum(["function"]),
  function: z.object({
    name: z.string(),
    description: z.string(),
    parameters: z.object({
      type: z.literal("object"),
      properties: z.record(
        z.union([stringPropertySchema, numberPropertySchema])
      ),
      required: z.array(z.string()),
      additionalProperties: z.literal(false),
    }),
  }),
});

export type Tool = z.infer<typeof toolSchema>;

export const toolCallMessageSchema = z.object({
  role: z.literal("assistant"),
  tool_calls: z.array(
    z.object({
      id: z.string(),
      type: z.literal("function"),
      function: z.object({
        name: z.string(),
        arguments: z.string(),
      }),
    })
  ),
});

export const toolCallChoiceSchema = z.object({
  index: z.number(),
  logprobs: z.null(),
  finish_reason: z.literal("tool_calls"),
  message: toolCallMessageSchema,
});

export type ToolCallChoice = z.infer<typeof toolCallChoiceSchema>;
export const stopChoiceSchema = z.object({
  index: z.number(),
  logprobs: z.null(),
  finish_reason: z.literal("stop"),
  message: chatCompletionMessageSchema,
});

export type StopChoice = z.infer<typeof stopChoiceSchema>;

export type ToolCallChatCompletionChoice = ToolCallChoice | StopChoice;

export const chatCompletionResponseSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: z.array(z.union([toolCallChoiceSchema, stopChoiceSchema])),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
});

export type ChatCompletionResponse = z.infer<
  typeof chatCompletionResponseSchema
>;
