import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import * as bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.CONFLICT, "User doesn't exists");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const dataForToken = {
    userId: userData.id,
    email: userData.email,
    role: userData.role,
    isProfileCompleted: userData.isProfileCompleted,
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

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.CONFLICT, "This user is not found ");
  }

  const dataForToken = {
    userId: userData.id,
    email: userData.email,
    needPasswordChange: userData.isProfileCompleted,
  };

  const accessToken = jwtHelpers.generateToken(
    dataForToken,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

const logInWithSocialMedia = async (payload: {
  email: string;
  profilePhoto?: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isProfileCompleted: true,
    },
  });

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "User does not exist. Please register first."
    );
  }

  const dataForToken = {
    userId: user.id,
    email: user.email,
    role: user.role,
    isProfileCompleted: user.isProfileCompleted,
  };

  const accessToken = jwtHelpers.generateToken(
    dataForToken,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    dataForToken,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  logInWithSocialMedia,
  // changePassword,
  // forgotPassword,
  // resetPassword,
};
