import React from "react";
import {
  BehaviorNodeProps,
  ChatCompletionMessage,
  chatCompletionResponseSchema,
  Tool,
  ToolCallChatCompletionChoice,
} from "../../types";
import { useMutation } from "@tanstack/react-query";

// {
//     "model": "lmstudio-community/qwen2.5-7b-instruct",
//     "messages": [{"role": "user", "content": "What dell products do you have under $50 in electronics?"}],
//     "tools": [
//       {
//         "type": "function",
//         "function": {
//           "name": "search_products",
//           "description": "Search the product catalog by various criteria. Use this whenever a customer asks about product availability, pricing, or specifications.",
//           "parameters": {
//             "type": "object",
//             "properties": {
//               "query": {
//                 "type": "string",
//                 "description": "Search terms or product name"
//               },
//               "category": {
//                 "type": "string",
//                 "description": "Product category to filter by",
//                 "enum": ["electronics", "clothing", "home", "outdoor"]
//               },
//               "max_price": {
//                 "type": "number",
//                 "description": "Maximum price in dollars"
//               }
//             },
//             "required": ["query"],
//             "additionalProperties": false
//           }
//         }
//       }
//     ]
//   }
interface ToolUseProps
  extends BehaviorNodeProps<ToolCallChatCompletionChoice, Error> {
  model: string;
  messages: ChatCompletionMessage[];
  tools: Tool[];
}

async function fetchToolUse(
  model: string,
  messages: ChatCompletionMessage[],
  tools: Tool[]
) {
  const response = await fetch("http://localhost:1234/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      tools,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tool use");
  }

  return response.json();
}

export default function ToolUse({
  messages,
  tools,
  model,
  onSuccess,
  onError,
}: ToolUseProps) {
  const toolUsePostMutation = useMutation({
    mutationFn: () => fetchToolUse(model, messages, tools),
    onSuccess: (data: ToolCallChatCompletionChoice) => {
      const validatedData = chatCompletionResponseSchema.parse(data);
      const choice = validatedData.choices[0];
      onSuccess(choice);
    },
    onError: (error) => {
      console.error(error);
      onError(error);
    },
  });

  const submittedRef = React.useRef(false);
  React.useEffect(() => {
    if (submittedRef.current) return;
    toolUsePostMutation.mutate();
    submittedRef.current = true;
  }, [toolUsePostMutation]);

  return null;
}
