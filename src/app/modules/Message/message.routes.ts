import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { MessageController } from "./message.controller";

const router = express.Router();

router.get(
  "/contacts",
  auth(UserRole.admin, UserRole.landlord, UserRole.tenant),
  MessageController.getAllContacts
);

router.get(
  "/chats",
  auth(UserRole.admin, UserRole.landlord, UserRole.tenant),
  MessageController.getChatList
);

router.post(
  "/send/:id",
  auth(UserRole.admin, UserRole.landlord, UserRole.tenant),
  MessageController.sendMessage
);

export const MessageRoutes = router;
