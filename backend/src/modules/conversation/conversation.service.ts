import { ConversationStatus } from "@prisma/client";
import { prisma } from "../../db/client";
import {
  CreateConversationBody,
  CreateMessageBody,
  UpdateConversationBody,
} from "./conversation.types";

type HttpError = Error & { statusCode?: number };

const makeError = (message: string, statusCode: number): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

const ensureContact = async (contactId: string, tenantId: string) => {
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, tenantId },
  });
  if (!contact) {
    throw makeError("Contact not found", 404);
  }
  return contact;
};

const ensureBot = async (botId: string, tenantId: string) => {
  const bot = await prisma.bot.findFirst({
    where: { id: botId, tenantId },
  });
  if (!bot) {
    throw makeError("Bot not found", 404);
  }
  return bot;
};

const ensureChannel = async (channelId: string, tenantId: string) => {
  const channel = await prisma.channel.findFirst({
    where: { id: channelId, tenantId },
  });
  if (!channel) {
    throw makeError("Channel not found", 404);
  }
  return channel;
};

const ensureConversation = async (id: string, tenantId: string) => {
  const conversation = await prisma.conversation.findFirst({
    where: { id, tenantId },
  });
  if (!conversation) {
    throw makeError("Conversation not found", 404);
  }
  return conversation;
};

export const listConversations = (tenantId: string, status?: ConversationStatus) => {
  return prisma.conversation.findMany({
    where: {
      tenantId,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      contact: { select: { id: true, name: true, channel: true } },
      bot: { select: { id: true, name: true } },
      channel: { select: { id: true, type: true } },
    },
  });
};

export const getConversation = (tenantId: string, id: string) => {
  return prisma.conversation
    .findFirst({
      where: { id, tenantId },
      include: {
        contact: true,
        bot: true,
        channel: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
    })
    .then((conversation) => {
      if (!conversation) {
        throw makeError("Conversation not found", 404);
      }
      return conversation;
    });
};

export const createConversation = async (
  tenantId: string,
  data: CreateConversationBody
) => {
  await ensureContact(data.contactId, tenantId);

  if (data.botId) {
    await ensureBot(data.botId, tenantId);
  }

  if (data.channelId) {
    await ensureChannel(data.channelId, tenantId);
  }

  return prisma.conversation.create({
    data: {
      tenantId,
      contactId: data.contactId,
      botId: data.botId,
      channelId: data.channelId,
      status: "OPEN",
    },
  });
};

export const updateConversation = async (
  tenantId: string,
  id: string,
  data: UpdateConversationBody
) => {
  await ensureConversation(id, tenantId);

  return prisma.conversation.update({
    where: { id },
    data: {
      status: data.status,
    },
  });
};

export const listMessages = async (tenantId: string, conversationId: string) => {
  await ensureConversation(conversationId, tenantId);

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
};

export const createMessage = async (
  tenantId: string,
  conversationId: string,
  data: CreateMessageBody
) => {
  await ensureConversation(conversationId, tenantId);

  return prisma.message.create({
    data: {
      conversationId,
      senderType: data.senderType,
      content: data.content,
    },
  });
};
