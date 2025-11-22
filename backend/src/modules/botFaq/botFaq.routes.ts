import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { requireRole } from "../../middleware/requireRole";
import * as botFaqController from "./botFaq.controller";
import { CreateBotFaqSchema, UpdateBotFaqSchema } from "./botFaq.types";

// Routes for managing FAQs per bot (tenant-scoped via authGuard at mount).
const router = Router({ mergeParams: true });

router.get("/:botId/faqs", botFaqController.listFaqs);
router.post(
  "/:botId/faqs",
  requireRole("OWNER", "ADMIN"),
  validateBody(CreateBotFaqSchema),
  botFaqController.createFaq
);
router.patch(
  "/:botId/faqs/:faqId",
  requireRole("OWNER", "ADMIN"),
  validateBody(UpdateBotFaqSchema),
  botFaqController.updateFaq
);
router.delete("/:botId/faqs/:faqId", requireRole("OWNER", "ADMIN"), botFaqController.deleteFaq);

export const botFaqRoutes = router;
