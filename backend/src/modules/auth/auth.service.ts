import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db/client";
import { config } from "../../config/env";
import {
  AuthResponse,
  AuthTokenPayload,
  LoginRequestBody,
  RegisterRequestBody,
} from "./auth.types";
import { toAuthenticatedUser } from "../user/user.model";
import { toPublicTenant } from "../tenant/tenant.model";

const TOKEN_EXPIRATION = "7d";

type HttpError = Error & { statusCode?: number };

const makeError = (message: string, statusCode: number): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

const upsertRole = async (name: string) => {
  return prisma.role.upsert({
    where: { name },
    update: {},
    create: { name },
  });
};

const signToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: TOKEN_EXPIRATION });

// Create a new tenant with its first user (OWNER).
export const register = async (
  input: RegisterRequestBody
): Promise<AuthResponse> => {
  const email = input.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw makeError("Email already in use", 400);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const ownerRole = await upsertRole("OWNER");

  const { tenant, user } = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { name: input.tenantName.trim() },
    });

    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        tenantId: tenant.id,
        roleId: ownerRole.id,
      },
      include: { tenant: true, role: true },
    });

    return { tenant, user };
  });

  const tokenPayload: AuthTokenPayload = {
    userId: user.id,
    tenantId: tenant.id,
    roleName: user.role.name,
  };

  return {
    token: signToken(tokenPayload),
    user: toAuthenticatedUser(user),
    tenant: toPublicTenant(tenant),
  };
};

// Authenticate an existing user and return a JWT.
export const login = async (input: LoginRequestBody): Promise<AuthResponse> => {
  const email = input.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email },
    include: { tenant: true, role: true },
  });

  if (!user) {
    throw makeError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw makeError("Invalid credentials", 401);
  }

  const tokenPayload: AuthTokenPayload = {
    userId: user.id,
    tenantId: user.tenantId,
    roleName: user.role.name,
  };

  return {
    token: signToken(tokenPayload),
    user: toAuthenticatedUser(user),
    tenant: toPublicTenant(user.tenant),
  };
};
