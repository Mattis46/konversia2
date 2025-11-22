import { NextFunction, Request, Response } from "express";
import {
  ConversationStatus,
  MessageSenderType,
} from "@prisma/client";
import * as conversationService from "./conversation.service";
import {
  CreateConversationBody,
  CreateMessageBody,
  UpdateConversationBody,
} from "./conversation.types";

const isValidStatus = (value: unknown): value is ConversationStatus =>
  value === "OPEN" || value === "RESOLVED" || value === "ESCALATED";

const isValidSenderType = (value: unknown): value is MessageSenderType =>
  value === "CUSTOMER" || value === "BOT" || value === "AGENT";

const badRequest = (message: string) => {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = 400;
  return error;
};

export const listConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    let parsedStatus: ConversationStatus | undefined;

    if (status !== undefined) {
      if (!isValidStatus(status)) {
        throw badRequest("Invalid status");
      }
      parsedStatus = status;
    }

    const conversations = await conversationService.listConversations(
      req.user!.tenantId,
      parsedStatus
    );
    return res.json(conversations);
  } catch (error) {
    return next(error);
  }
};

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conversation = await conversationService.getConversation(
      req.user!.tenantId,
      req.params.id
    );
    return res.json(conversation);
  } catch (error) {
    return next(error);
  }
};

export const createConversation = async (
  req: Request<unknown, unknown, CreateConversationBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const conversation = await conversationService.createConversation(
      req.user!.tenantId,
      req.body
    );
    return res.status(201).json(conversation);
  } catch (error) {
    return next(error);
  }
};

export const updateConversation = async (
  req: Request<{ id: string }, unknown, UpdateConversationBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isValidStatus(req.body.status)) {
      throw badRequest("Invalid status");
    }

    const conversation = await conversationService.updateConversation(
      req.user!.tenantId,
      req.params.id,
      req.body
    );
    return res.json(conversation);
  } catch (error) {
    return next(error);
  }
};

export const listMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await conversationService.listMessages(
      req.user!.tenantId,
      req.params.id
    );
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
};

export const createMessage = async (
  req: Request<{ id: string }, unknown, CreateMessageBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isValidSenderType(req.body.senderType)) {
      throw badRequest("Invalid senderType");
    }

    const message = await conversationService.createMessage(
      req.user!.tenantId,
      req.params.id,
      req.body
    );
    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
};
