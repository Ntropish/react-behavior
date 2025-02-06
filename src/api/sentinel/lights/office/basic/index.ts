import { z } from "zod";

export const simpleUpdateSchema = z.object({
  bri: z.number().optional(),
  sat: z.number().optional(),
  hue: z.number().optional(),
  on: z.boolean().optional(),
});

type SimpleUpdate = z.infer<typeof simpleUpdateSchema>;

export default async function sentinel_lights_office_basic(body: SimpleUpdate) {
  const url = `/sentinel/lights/office/basic`;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const response = await fetch(url, {
    headers,
    method: "PUT",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  return data;
}
