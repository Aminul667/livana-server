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
    description,
    price,
    listingType,
    propertyType,
    purpose,
    address,
    city,
    state,
    postalCode,
    country,
    latitude,
    longitude,
    bedrooms,
    bathrooms,
    areaSqFt,
    floorNumber,
    totalFloors,
    furnished,
    // coverImage
    availableFrom,
    // availableMonth
    // availableMonthNumber
    rentFrequency,
    depositAmount,
    maintenanceFee,
    // amenities,
    hasParking,
    hasLift,
    hasBalcony,
    heating,
    cooling,
    petFriendly,
    internetIncluded,
    videoUrl,
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
    videoUrl,
  };

  const amenities = Object.entries(amenitiesObject)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const propertyData = {
    userId,
    description,
    price,
    listingType,
    propertyType,
    purpose,
    address,
    city,
    state,
    postalCode,
    country,
    latitude,
    longitude,
    bedrooms,
    bathrooms,
    areaSqFt,
    floorNumber,
    totalFloors,
    furnished,
    coverImage,
    availableFrom,
    availableMonth,
    availableMonthNumber,
    rentFrequency,
    depositAmount,
    maintenanceFee,
    amenities,
    hasParking,
    hasLift,
    hasBalcony,
    heating,
    cooling,
    petFriendly,
    internetIncluded,
    videoUrl,
  };

  console.log("imageFiles", uploadedImagePaths);
    console.log("coverImage", coverImage);

  return propertyData;
};

export const ListingService = {
  addPropertyIntoDB,
};
