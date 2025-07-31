import { Request } from "express";

export interface IUser {
  email: string;
  password: string;
  role: "landlord" | "tenant" | "admin";
}

export interface IAuthUser {
  userId: string;
  email: string;
  password: string;
  role: "landlord" | "tenant" | "admin";
  isProfileCompleted: boolean;
}

export interface IAuthRequest extends Request {
  user?: IAuthUser;
}
