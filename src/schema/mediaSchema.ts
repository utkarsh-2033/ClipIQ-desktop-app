import { z } from "zod";

export const mediaSchema = z.object({
  display: z.string(),
  audio: z.string(),
  preset: z.enum(["HD", "SD"]),
});
