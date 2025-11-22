import { z } from "zod";

// DTOs for bot operations.
export type CreateBotBody = {
  name: string;
  isActive?: boolean;
};

export type UpdateBotBody = {
  name?: string;
  isActive?: boolean;
};

export const CreateBotSchema = z.object({
  name: z.string().trim().min(1),
  isActive: z.boolean().optional(),
});

export const UpdateBotSchema = z.object({
  name: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
});
