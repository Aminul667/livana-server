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
    },
  });

  return filteredUsers;
};

export const MessageService = {
  sendMessage,
  getAllContactsFromDB,
};
