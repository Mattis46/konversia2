import { MessageSenderType } from "@prisma/client";
import { z } from "zod";

export interface WebchatMessageRequest {
  botId: string;
  message: string;
  contact?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  conversationId?: string;
}

export interface WebchatMessageResponse {
  botId: string;
  contactId: string;
  conversationId: string;
  reply: string;
  messages?: {
    senderType: MessageSenderType;
    content: string;
    createdAt: Date;
  }[];
}

export const WebchatMessageSchema = z.object({
  botId: z.string().trim().min(1),
  message: z.string().trim().min(1),
  conversationId: z.string().trim().min(1).optional(),
  contact: z
    .object({
      id: z.string().trim().min(1).optional(),
      name: z.string().trim().optional(),
      email: z.string().trim().email().optional(),
      phone: z.string().trim().optional(),
    })
    .optional(),
});
