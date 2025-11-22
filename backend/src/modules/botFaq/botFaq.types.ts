import { z } from "zod";

// DTOs for Bot FAQ operations.
export type CreateBotFaqBody = {
  question: string;
  answer: string;
};

export type UpdateBotFaqBody = {
  question?: string;
  answer?: string;
};

export const CreateBotFaqSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

export const UpdateBotFaqSchema = z.object({
  question: z.string().trim().min(1).optional(),
  answer: z.string().trim().min(1).optional(),
});
