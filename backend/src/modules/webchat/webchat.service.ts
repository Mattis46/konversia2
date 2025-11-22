import { MessageSenderType } from "@prisma/client";
import { prisma } from "../../db/client";
import { generateReplyForWebchat } from "../../services/ai.service";
import {
  WebchatMessageRequest,
  WebchatMessageResponse,
} from "./webchat.types";

type HttpError = Error & { statusCode?: number };

const makeError = (message: string, statusCode: number): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

export const processIncomingMessage = async (
  payload: WebchatMessageRequest
): Promise<WebchatMessageResponse> => {
  if (!payload.message?.trim()) {
    throw makeError("Message is required", 400);
  }

  const bot = await prisma.bot.findFirst({
    where: { id: payload.botId, isActive: true },
  });
  if (!bot) {
    throw makeError("Bot not found or inactive", 404);
  }
  const tenantId = bot.tenantId;

  // Resolve contact
  const contactInput = payload.contact;
  let contact =
    (contactInput?.id
      ? await prisma.contact.findFirst({
          where: { id: contactInput.id, tenantId },
        })
      : null) ?? null;

  if (contactInput?.id && !contact) {
    throw makeError("Contact not found", 404);
  }

  if (!contact && (contactInput?.email || contactInput?.phone)) {
    const email = contactInput?.email?.toLowerCase().trim();
    const phone = contactInput?.phone?.trim();
    contact =
      (email
        ? await prisma.contact.findFirst({
            where: { tenantId, email },
          })
        : null) ??
      (phone
        ? await prisma.contact.findFirst({
            where: { tenantId, phone },
          })
        : null);
  }

  if (!contact) {
    contact = await prisma.contact.create({
      data: {
        tenantId,
        name: contactInput?.name?.trim(),
        email: contactInput?.email?.toLowerCase().trim(),
        phone: contactInput?.phone?.trim(),
        channel: "WEBSITE",
      },
    });
  }

  // Resolve conversation
  let conversation =
    (payload.conversationId
      ? await prisma.conversation.findFirst({
          where: {
            id: payload.conversationId,
            tenantId,
            contactId: contact.id,
            botId: bot.id,
          },
        })
      : null) ?? null;

  if (payload.conversationId && !conversation) {
    throw makeError("Conversation not found", 404);
  }

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        tenantId,
        botId: bot.id,
        contactId: contact.id,
        status: "OPEN",
      },
    });
  }

  // Store customer message
  const customerMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: MessageSenderType.CUSTOMER,
      content: payload.message.trim(),
    },
  });

  const faqs = await prisma.botFaq.findMany({
    where: { botId: bot.id, tenantId },
    orderBy: { createdAt: "desc" },
  });

  const profile = await prisma.botProfile.findFirst({
    where: { botId: bot.id, tenantId },
  });

  // Generate placeholder reply
  const reply = await generateReplyForWebchat({
    botName: bot.name,
    userMessage: payload.message.trim(),
    faqs: faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
    profile: profile
      ? {
          description: profile.description,
          openingHours: profile.openingHours,
          location: profile.location,
        }
      : undefined,
  });

  const botMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: MessageSenderType.BOT,
      content: reply,
    },
  });

  return {
    botId: bot.id,
    contactId: contact.id,
    conversationId: conversation.id,
    reply,
    messages: [
      {
        senderType: customerMessage.senderType,
        content: customerMessage.content,
        createdAt: customerMessage.createdAt,
      },
      {
        senderType: botMessage.senderType,
        content: botMessage.content,
        createdAt: botMessage.createdAt,
      },
    ],
  };
};
