import { prisma } from "../../db/client";
import { CreateContactBody, UpdateContactBody } from "./contact.types";

type HttpError = Error & { statusCode?: number };

const makeError = (message: string, statusCode: number): HttpError => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
};

const getContactOrThrow = async (id: string, tenantId: string) => {
  const contact = await prisma.contact.findFirst({
    where: { id, tenantId },
  });

  if (!contact) {
    throw makeError("Contact not found", 404);
  }

  return contact;
};

export const listContacts = (tenantId: string) => {
  return prisma.contact.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
};

export const createContact = (tenantId: string, data: CreateContactBody) => {
  return prisma.contact.create({
    data: {
      tenantId,
      name: data.name?.trim(),
      email: data.email?.toLowerCase().trim(),
      phone: data.phone?.trim(),
      channel: data.channel,
    },
  });
};

export const getContact = (tenantId: string, id: string) =>
  getContactOrThrow(id, tenantId);

export const updateContact = async (
  tenantId: string,
  id: string,
  data: UpdateContactBody
) => {
  await getContactOrThrow(id, tenantId);

  return prisma.contact.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.email !== undefined ? { email: data.email.toLowerCase().trim() } : {}),
      ...(data.phone !== undefined ? { phone: data.phone.trim() } : {}),
    },
  });
};

export const deleteContact = async (tenantId: string, id: string) => {
  await getContactOrThrow(id, tenantId);
  await prisma.contact.delete({ where: { id } });
};
