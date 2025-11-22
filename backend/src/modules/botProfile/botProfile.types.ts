import { z } from "zod";

// DTOs for bot profile operations.
export type UpsertBotProfileBody = {
  description?: string;
  openingHours?: string;
  location?: string;
};

export const UpsertBotProfileSchema = z.object({
  description: z.string().trim().optional(),
  openingHours: z.string().trim().optional(),
  location: z.string().trim().optional(),
});
