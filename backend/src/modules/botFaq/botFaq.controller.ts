import { NextFunction, Request, Response } from "express";
import * as botFaqService from "./botFaq.service";
import { CreateBotFaqBody, UpdateBotFaqBody } from "./botFaq.types";

export const listFaqs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const faqs = await botFaqService.listFaqs(req.user!.tenantId, req.params.botId);
    return res.json(faqs);
  } catch (error) {
    return next(error);
  }
};

export const createFaq = async (
  req: Request<{ botId: string }, unknown, CreateBotFaqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const faq = await botFaqService.createFaq(req.user!.tenantId, req.params.botId, req.body);
    return res.status(201).json(faq);
  } catch (error) {
    return next(error);
  }
};

export const updateFaq = async (
  req: Request<{ botId: string; faqId: string }, unknown, UpdateBotFaqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const faq = await botFaqService.updateFaq(
      req.user!.tenantId,
      req.params.botId,
      req.params.faqId,
      req.body
    );
    return res.json(faq);
  } catch (error) {
    return next(error);
  }
};

export const deleteFaq = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await botFaqService.deleteFaq(req.user!.tenantId, req.params.botId, req.params.faqId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
