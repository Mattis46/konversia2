import crypto from "crypto";
import { prisma } from "../../db/client";
import { ResendVerificationBody, VerifyEmailBody } from "./emailVerification.types";

const VERIFICATION_EXPIRATION_HOURS = 24;

export const createVerificationToken = async (userId: string) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + VERIFICATION_EXPIRATION_HOURS * 60 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: { userId, token, expiresAt },
  });

  return token;
};

export const resendVerification = async (input: ResendVerificationBody) => {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase().trim() } });
  if (!user || user.emailVerified) {
    return null; // avoid leaking existence or status
  }

  // Invalidate old tokens
  await prisma.emailVerificationToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  return createVerificationToken(user.id);
};

export const verifyEmail = async (input: VerifyEmailBody) => {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token: input.token } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw Object.assign(new Error("Invalid or expired token"), { statusCode: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.update({ where: { token: input.token }, data: { usedAt: new Date() } }),
  ]);
};
