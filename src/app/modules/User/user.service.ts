import { hashedPasswordHelper } from "../../../helpers/hashPasswordHelper";
import prisma from "../../../shared/prisma";
import { IUser } from "./user.interface";

const createAdminIntoDB = async (payload: IUser) => {
  const { email, password } = payload;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("Admin already exists with this email");
  }

  // Hash the password
  const hashedPassword = await hashedPasswordHelper(password);

  // Create admin user
  const createdUser = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  // Return safe user data (omit password)
  return {
    id: createdUser.id,
    email: createdUser.email,
    needPasswordChange: createdUser.needPasswordChange,
    createdAt: createdUser.createdAt,
  };
};

export const userService = {
  createAdminIntoDB,
};
