import prisma from "../../../shared/prisma";
import { IAuthRequest } from "../User/user.interface";
import { extractMonthInfo } from "./listing.utils";

const addPropertyIntoDB = async (req: IAuthRequest) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const imageFiles = req.files as { images: Express.Multer.File[] };

  if (!imageFiles?.images?.length) {
    throw new Error("At least one image is required.");
  }

  const uploadedImagePaths = imageFiles.images.map((img) => img.path) || [];

  const userId = req.user.userId;
  const {
    availableFrom,
    hasParking,
    hasLift,
    hasBalcony,
    heating,
    cooling,
    petFriendly,
    internetIncluded,
  } = req.body;

  const coverImage = uploadedImagePaths[0];
  const { availableMonth, availableMonthNumber } =
    extractMonthInfo(availableFrom);

  const amenitiesObject = {
    hasParking,
    hasLift,
    hasBalcony,
    heating,
    cooling,
    petFriendly,
    internetIncluded,
  };

  const amenities = Object.entries(amenitiesObject)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const propertyData = {
    userId,
    ...req.body,
    coverImage,
    availableMonth,
    availableMonthNumber,
    amenities,
  };

  const result = await prisma.$transaction(async (tx) => {
    const property = await tx.property.create({
      data: propertyData,
    });

    const imageData = uploadedImagePaths.map((path) => ({
      propertyId: property.id,
      url: path,
    }));

    await tx.propertyImage.createMany({
      data: imageData,
    });

    return property;
  });

  return result;
};

export const ListingService = {
  addPropertyIntoDB,
};
