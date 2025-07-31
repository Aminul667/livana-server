import { hashedPasswordHelper } from "../../../helpers/hashPasswordHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { IAuthRequest, IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { email, password, role } = payload;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "User already exists with this email"
    );
  }

  // Hash the password
  const hashedPassword = await hashedPasswordHelper(password);

  // Create admin user
  const createdUser = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      role: role,
    },
  });

  // Return safe user data (omit password)
  return {
    id: createdUser.id,
    email: createdUser.email,
    role: createdUser.role,
    isProfileCompleted: createdUser.isProfileCompleted,
    createdAt: createdUser.createdAt,
  };
};

const updateUserProfileIntoDB = async (req: IAuthRequest) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const { firstName, lastName, phone, location, about } = req.body;
  const userId = req.user.userId;
  const profilePhoto = req.file?.path || "";

  const profileData = {
    firstName,
    lastName,
    phone,
    location,
    about,
    profilePhoto,
  };

  const result = await prisma.$transaction(async (tx) => {
    const updatedProfile = await tx.profile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { isProfileCompleted: true },
    });

    return updatedProfile;
  });

  return result;
};

export const userService = {
  createUserIntoDB,
  updateUserProfileIntoDB,
};
