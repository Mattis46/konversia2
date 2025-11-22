import { ChannelType } from "@prisma/client";
import { z } from "zod";

// DTOs for contact operations.
export type CreateContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  channel?: ChannelType;
};

export type UpdateContactBody = {
  name?: string;
  email?: string;
  phone?: string;
};

export const CreateContactSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  channel: z.nativeEnum(ChannelType).optional(),
});

export const UpdateContactSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
});
