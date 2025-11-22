import { prisma } from "../../db/client";
import { CreateBotBody, UpdateBotBody } from "./bot.types";

type HttpError = Error & { statusCode?: number };

const makeError = (message: string, statusCode: number): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

const getBotOrThrow = async (id: string, tenantId: string) => {
  const bot = await prisma.bot.findFirst({
    where: { id, tenantId },
  });

  if (!bot) {
    throw makeError("Bot not found", 404);
  }

  return bot;
};

export const listBots = (tenantId: string) => {
  return prisma.bot.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
};

export const createBot = (tenantId: string, data: CreateBotBody) => {
  return prisma.bot.create({
    data: {
      tenantId,
      name: data.name,
      isActive: data.isActive ?? true,
    },
  });
};

export const getBot = (tenantId: string, id: string) => getBotOrThrow(id, tenantId);

export const updateBot = async (tenantId: string, id: string, data: UpdateBotBody) => {
  await getBotOrThrow(id, tenantId);

  return prisma.bot.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
  });
};

export const deleteBot = async (tenantId: string, id: string) => {
  await getBotOrThrow(id, tenantId);
  await prisma.bot.delete({ where: { id } });
};
