import { NextFunction, Request, Response } from "express";
import * as botService from "./bot.service";
import { CreateBotBody, UpdateBotBody } from "./bot.types";

// Return all bots for the current tenant.
export const listBots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bots = await botService.listBots(req.user!.tenantId);
    return res.json(bots);
  } catch (error) {
    return next(error);
  }
};

export const createBot = async (
  req: Request<unknown, unknown, CreateBotBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bot = await botService.createBot(req.user!.tenantId, req.body);
    return res.status(201).json(bot);
  } catch (error) {
    return next(error);
  }
};

export const getBot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bot = await botService.getBot(req.user!.tenantId, req.params.id);
    return res.json(bot);
  } catch (error) {
    return next(error);
  }
};

export const updateBot = async (
  req: Request<{ id: string }, unknown, UpdateBotBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const bot = await botService.updateBot(req.user!.tenantId, req.params.id, req.body);
    return res.json(bot);
  } catch (error) {
    return next(error);
  }
};

export const deleteBot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await botService.deleteBot(req.user!.tenantId, req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
