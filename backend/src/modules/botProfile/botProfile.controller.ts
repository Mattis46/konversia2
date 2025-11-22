import { NextFunction, Request, Response } from "express";
import * as botProfileService from "./botProfile.service";
import { UpsertBotProfileBody } from "./botProfile.types";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await botProfileService.getProfile(req.user!.tenantId, req.params.botId);
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

export const upsertProfile = async (
  req: Request<{ botId: string }, unknown, UpsertBotProfileBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await botProfileService.upsertProfile(
      req.user!.tenantId,
      req.params.botId,
      req.body
    );
    return res.status(200).json(profile);
  } catch (error) {
    return next(error);
  }
};
