import { prisma } from "../../db/client";
import { UpsertBotProfileBody } from "./botProfile.types";

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

export const getProfile = async (tenantId: string, botId: string) => {
  await ensureBot(botId, tenantId);
  return prisma.botProfile.findFirst({
    where: { botId, tenantId },
  });
};

export const upsertProfile = async (
  tenantId: string,
  botId: string,
  data: UpsertBotProfileBody
) => {
  await ensureBot(botId, tenantId);

  const existing = await prisma.botProfile.findFirst({
    where: { botId, tenantId },
  });

  if (existing) {
    return prisma.botProfile.update({
      where: { id: existing.id },
      data: {
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.openingHours !== undefined ? { openingHours: data.openingHours } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
      },
    });
  }

  return prisma.botProfile.create({
    data: {
      tenantId,
      botId,
      description: data.description,
      openingHours: data.openingHours,
      location: data.location,
    },
  });
};
