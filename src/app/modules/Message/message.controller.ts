import { Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthRequest } from "../User/user.interface";
import ApiError from "../../errors/ApiErrors";
import { MessageService } from "./message.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { getReceiverSocketId, io } from "../../../socket";

const sendMessage = catchAsync(async (req: IAuthRequest, res: Response) => {
  const senderId = req.user?.userId;
  const { id: receiverId } = req.params;
  const payload = req.body;

  if (!senderId) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
  }

  const result = await MessageService.sendMessage(
    senderId,
    receiverId,
    payload
  );

  // ✅ After message saved, emit via socket
  const receiverSocketId = getReceiverSocketId(receiverId);
  const senderSocketId = getReceiverSocketId(senderId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("new_message", result);
  }

  // Optionally emit to sender (for UI confirmation)
  if (senderSocketId) {
    io.to(senderSocketId).emit("new_message", result);
  }

  // ✅ Debug log (add it HERE)
  console.log("📤 Emitted new_message to:", {
    receiverSocketId,
    senderSocketId,
    messageId: result.id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message has been sent successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: IAuthRequest, res: Response) => {
  const id = req.user?.userId;

  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
  }

  const result = await MessageService.getAllContactsFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contacts have been retrieved successfully!",
    data: result,
  });
});

const getChatList = catchAsync(async (req: IAuthRequest, res: Response) => {
  const id = req.user?.userId;

  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
  }

  const result = await MessageService.getChatListFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chats have been retrieved successfully!",
    data: result,
  });
});

const getMessageByUserId = catchAsync(
  async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      throw new ApiError(httpStatus.NOT_FOUND, "User is not included");
    }

    const result = await MessageService.getMessageByUserId(userId, id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Chats have been retrieved successfully!",
      data: result,
    });
  }
);

export const MessageController = {
  sendMessage,
  getAllContacts,
  getChatList,
  getMessageByUserId,
};
