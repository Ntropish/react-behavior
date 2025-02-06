import React from "react";
import ToolUse from "../behaviors/tasks/ToolUse";
import {
  BehaviorNodeProps,
  ChatCompletionMessage,
  Tool,
  ToolCallChatCompletionChoice,
} from "../types";

import { z } from "zod";
import sentinel_lights_office_basic from "../api/sentinel/lights/office/basic";

interface ChooseProcedureProps
  extends BehaviorNodeProps<ToolCallChatCompletionChoice, Error> {
  messages: ChatCompletionMessage[];
}

const procedures: Tool[] = [
  {
    type: "function",
    function: {
      name: "riddle",
      description: "Pose a riddle to the user as a fallback.",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The riddle to pose to the user.",
          },
          answer: {
            type: "string",
            description: "The answer to the riddle.",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_background_color",
      description: "Set the color of the background.",
      parameters: {
        type: "object",
        properties: {
          hex: {
            type: "string",
            description: "The hex code of the color to set the background to.",
          },
        },
        required: ["hex"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_room_color",
      description: "Set the color of the lights in the room.",
      parameters: {
        type: "object",
        properties: {
          bri: { type: "number", description: "The brightness of the lights." },
          sat: { type: "number", description: "The saturation of the lights." },
          hue: { type: "number", description: "The hue of the lights." },
          on: { type: "boolean", description: "Whether the lights are on." },
        },
        required: ["hex"],
        additionalProperties: false,
      },
    },
  },
];

const set_background_color_argumentSchema = z.object({
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

const riddle_argumentSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const set_room_color_argumentSchema = z.object({
  bri: z.number().min(0).max(255),
  sat: z.number().min(0).max(255),
  hue: z.number().min(0).max(65535),
  on: z.boolean(),
});

const ChooseProcedureBehavior: React.FC<ChooseProcedureProps> = ({
  messages,
  onError,
  onSuccess,
}) => {
  const handleSuccess = (choice: ToolCallChatCompletionChoice) => {
    onSuccess(choice);

    if (choice.finish_reason === "tool_calls") {
      const [tool_call] = choice.message.tool_calls ?? [];

      if (tool_call) {
        switch (tool_call.function.name) {
          case "set_background_color": {
            const args = JSON.parse(tool_call.function.arguments);
            const result = set_background_color_argumentSchema.safeParse(args);

            if (result.success) {
              document.body.style.backgroundColor = result.data.hex;
            } else {
              console.error(result.error);
            }

            break;
          }
          case "riddle": {
            const args = JSON.parse(tool_call.function.arguments);
            const result = riddle_argumentSchema.safeParse(args);

            if (result.success) {
              const { question, answer } = result.data;
              alert(`Riddle: ${question}\nAnswer: ${answer}`);
            } else {
              console.error(result.error);
            }

            break;
          }
          case "set_room_color": {
            const args = JSON.parse(tool_call.function.arguments);
            const result = set_room_color_argumentSchema.safeParse(args);

            if (result.success) {
              const { bri, sat, hue, on } = result.data;
              // console.log(bri, sat, hue, on);
              sentinel_lights_office_basic({
                bri,
                sat,
                hue,
                on,
              });
            } else {
              console.error(result.error);
            }
            break;
          }
          default:
            console.error("Unknown tool call", tool_call);
        }
      }
    }
  };

  const doctoredMessages = React.useMemo(() => {
    return [
      ...messages,
      {
        role: "system",
        content: "Choose a function from the predefined list and call it.",
      } as ChatCompletionMessage,
    ];
  }, [messages]);
  return (
    <ToolUse
      onSuccess={handleSuccess}
      onError={onError}
      messages={doctoredMessages}
      tools={procedures}
      model="lmstudio-community/qwen2.5-7b-instruct"
    />
  );
};

export default ChooseProcedureBehavior;
