import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../../db/client";
import { ForgotPasswordBody, ResetPasswordBody } from "./passwordReset.types";

const RESET_EXPIRATION_MINUTES = 15;

export const createResetToken = async (input: ForgotPasswordBody) => {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase().trim() } });
  if (!user) {
    // Avoid leaking existence
    return null;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_EXPIRATION_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return token;
};

export const resetPassword = async (input: ResetPasswordBody) => {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: input.token },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw Object.assign(new Error("Invalid or expired token"), { statusCode: 400 });
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { token: input.token }, data: { usedAt: new Date() } }),
  ]);
};
