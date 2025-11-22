import { ConversationStatus, MessageSenderType } from "@prisma/client";
import { z } from "zod";

// DTOs for conversation operations.
export type CreateConversationBody = {
  contactId: string;
  botId?: string;
  channelId?: string;
};

export type UpdateConversationBody = {
  status: ConversationStatus;
};

export type CreateMessageBody = {
  senderType: MessageSenderType;
  content: string;
};

export const CreateConversationSchema = z.object({
  contactId: z.string().trim().min(1),
  botId: z.string().trim().min(1).optional(),
  channelId: z.string().trim().min(1).optional(),
});

export const UpdateConversationSchema = z.object({
  status: z.nativeEnum(ConversationStatus),
});

export const CreateMessageSchema = z.object({
  senderType: z.nativeEnum(MessageSenderType),
  content: z.string().trim().min(1),
});
