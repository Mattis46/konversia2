import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { requireRole } from "../../middleware/requireRole";
import * as conversationController from "./conversation.controller";
import {
  CreateConversationSchema,
  CreateMessageSchema,
  UpdateConversationSchema,
} from "./conversation.types";

// Routes for conversations and messages scoped to a tenant.
const router = Router();

router.get("/", conversationController.listConversations);
router.post("/", validateBody(CreateConversationSchema), conversationController.createConversation);
router.get("/:id", conversationController.getConversation);
router.patch(
  "/:id",
  requireRole("OWNER", "ADMIN"),
  validateBody(UpdateConversationSchema),
  conversationController.updateConversation
);
router.get("/:id/messages", conversationController.listMessages);
router.post(
  "/:id/messages",
  validateBody(CreateMessageSchema),
  conversationController.createMessage
);

export const conversationRoutes = router;
