import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { TMessage } from "./message.interface";

const sendMessage = async (
  senderId: string,
  receiverId: string,
  payload: TMessage
) => {
  if (senderId === receiverId) {
    throw new ApiError(httpStatus.CONFLICT, "Cannot send message to yourself!");
  }

  if (!payload) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Message is needed");
  }

  const existingReceiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });

  if (!existingReceiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receiver not found");
  }

  const newMessage = {
    senderId,
    receiverId,
    text: payload.text,
    // imageUrl
  };

  const result = await prisma.message.create({
    data: newMessage,
  });

  return result;
};

const getAllContactsFromDB = async (loggedInUserId: string) => {
  const filteredUsers = await prisma.user.findMany({
    where: {
      id: {
        not: loggedInUserId,
      },
      isDeleted: false,
    },
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return filteredUsers;
};

const getChatListFromDB = async (userId: string) => {
  // Find all messages where the logged-in user is sender or receiver
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  // Extract unique partner IDs
  const chatPartnerIds = [
    ...new Set(
      messages.map((msg) =>
        msg.senderId === userId ? msg.receiverId : msg.senderId
      )
    ),
  ].filter(Boolean);

  const chatPartners = await prisma.user.findMany({
    where: {
      id: { in: chatPartnerIds },
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          profilePhoto: true,
        },
      },
    },
  });

  return chatPartners;
};

const getMessageByUserId = async (
  loggedInUserId: string,
  userToChatId: string
) => {
  // Find all messages between the two users (both directions)
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          AND: [{ senderId: loggedInUserId }, { receiverId: userToChatId }],
        },
        {
          AND: [{ senderId: userToChatId }, { receiverId: loggedInUserId }],
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages;
};

export const MessageService = {
  sendMessage,
  getAllContactsFromDB,
  getChatListFromDB,
  getMessageByUserId,
};
