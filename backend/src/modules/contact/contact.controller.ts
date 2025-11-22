import { NextFunction, Request, Response } from "express";
import * as contactService from "./contact.service";
import { CreateContactBody, UpdateContactBody } from "./contact.types";

// Manage contacts scoped to the current tenant.
export const listContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactService.listContacts(req.user!.tenantId);
    return res.json(contacts);
  } catch (error) {
    return next(error);
  }
};

export const createContact = async (
  req: Request<unknown, unknown, CreateContactBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const contact = await contactService.createContact(req.user!.tenantId, req.body);
    return res.status(201).json(contact);
  } catch (error) {
    return next(error);
  }
};

export const getContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await contactService.getContact(req.user!.tenantId, req.params.id);
    return res.json(contact);
  } catch (error) {
    return next(error);
  }
};

export const updateContact = async (
  req: Request<{ id: string }, unknown, UpdateContactBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const contact = await contactService.updateContact(
      req.user!.tenantId,
      req.params.id,
      req.body
    );
    return res.json(contact);
  } catch (error) {
    return next(error);
  }
};

export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await contactService.deleteContact(req.user!.tenantId, req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
