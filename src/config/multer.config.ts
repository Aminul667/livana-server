import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const removeExtension = (filename: string) => {
  return filename.split(".").slice(0, -1).join(".");
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (_req, file) => {
    return {
      public_id:
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        file.fieldname +
        "-" +
        removeExtension(file.originalname),
      folder: "arthur",
      access_mode: "public",
      resource_type: "auto",
      type: "upload",
    };
  },
});

export const multerUpload = multer({ storage });
