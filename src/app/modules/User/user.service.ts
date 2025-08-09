import { hashedPasswordHelper } from "../../../helpers/hashPasswordHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { IAuthRequest, IUser } from "./user.interface";
import { AuthServices } from "../Auth/auth.service";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";

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

    const user = await tx.user.update({
      where: { id: userId },
      data: { isProfileCompleted: true },
    });

    return { updatedProfile, user };
  });

  const dataForToken = {
    userId: result.user.id,
    email: result.user.email,
    role: result.user.role,
    isProfileCompleted: result.user.isProfileCompleted,
  };

  const accessToken = jwtHelpers.generateToken(
    dataForToken,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    dataForToken,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return { result: result.updatedProfile, accessToken, refreshToken };
};

const getMeFromDB = async (req: IAuthRequest) => {
  const userId = req.user?.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isProfileCompleted: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          location: true,
          about: true,
          profilePhoto: true,
        },
      },
    },
  });

  return user;
};

export const userService = {
  createUserIntoDB,
  updateUserProfileIntoDB,
  getMeFromDB,
};
