import { prisma } from "../../db/client";
import { CreateBotFaqBody, UpdateBotFaqBody } from "./botFaq.types";

type HttpError = Error & { statusCode?: number };

const makeError = (message: string, statusCode: number): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

const ensureBot = async (botId: string, tenantId: string) => {
  const bot = await prisma.bot.findFirst({ where: { id: botId, tenantId } });
  if (!bot) {
    throw makeError("Bot not found", 404);
  }
  return bot;
};

const ensureFaq = async (faqId: string, botId: string, tenantId: string) => {
  const faq = await prisma.botFaq.findFirst({
    where: { id: faqId, botId, tenantId },
  });
  if (!faq) {
    throw makeError("FAQ not found", 404);
  }
  return faq;
};

export const listFaqs = async (tenantId: string, botId: string) => {
  await ensureBot(botId, tenantId);
  return prisma.botFaq.findMany({
    where: { tenantId, botId },
    orderBy: { createdAt: "desc" },
  });
};

export const createFaq = async (
  tenantId: string,
  botId: string,
  data: CreateBotFaqBody
) => {
  await ensureBot(botId, tenantId);
  return prisma.botFaq.create({
    data: {
      tenantId,
      botId,
      question: data.question,
      answer: data.answer,
    },
  });
};

export const updateFaq = async (
  tenantId: string,
  botId: string,
  faqId: string,
  data: UpdateBotFaqBody
) => {
  await ensureBot(botId, tenantId);
  await ensureFaq(faqId, botId, tenantId);

  return prisma.botFaq.update({
    where: { id: faqId },
    data: {
      ...(data.question !== undefined ? { question: data.question } : {}),
      ...(data.answer !== undefined ? { answer: data.answer } : {}),
    },
  });
};

export const deleteFaq = async (tenantId: string, botId: string, faqId: string) => {
  await ensureBot(botId, tenantId);
  await ensureFaq(faqId, botId, tenantId);
  await prisma.botFaq.delete({ where: { id: faqId } });
};
