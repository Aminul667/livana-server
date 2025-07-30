import * as bcrypt from "bcrypt";
import config from "../config";

export const hashedPasswordHelper = async (password: string): Promise<string> => {
  const saltRounds: number = Number(config.bcrypt_salt_rounds);
  try {
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};
