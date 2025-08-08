import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IAuthRequest } from "../User/user.interface";
import { extractMonthInfo } from "./listing.utils";
import { booleanFields, listingSearchableFields } from "./listing.constants";
import { paginationHelper } from "../../../helpers/paginationHelper";

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

const getAllPropertiesFromDB = async (
  filters: any,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const {
    searchTerm,
    minBedrooms,
    maxBedrooms,
    minMonthlyRent,
    maxMonthlyRent,
    lat,
    lon,
    maxDistance,
    ...filterData
  } = filters;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: listingSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // for range of filtering
  if (minBedrooms && maxBedrooms) {
    andConditions.push({
      bedrooms: {
        gte: Number(minBedrooms),
        lte: Number(maxBedrooms),
      },
    });
  }

  if (minMonthlyRent && maxMonthlyRent) {
    andConditions.push({
      price: {
        gte: Number(minMonthlyRent),
        lte: Number(maxMonthlyRent),
      },
    });
  }

  for (const key in filterData) {
    if (booleanFields.includes(key) && typeof filterData[key] === "string") {
      if (filterData[key] === "true") {
        filterData[key] = true;
      } else if (filterData[key] === "false") {
        filterData[key] = false;
      }
    }
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  if (lat && lon) {
    const distanceFilter = maxDistance
      ? Prisma.sql`HAVING distance <= ${maxDistance}`
      : Prisma.empty;

    const rawQuery = Prisma.sql`
      SELECT *, (
        6371 * acos(
          cos(radians(${Number(
            lat
          )})) * cos(radians("latitude"::double precision)) *
          cos(radians("longitude"::double precision) - radians(${Number(
            lon
          )})) +
          sin(radians(${Number(
            lat
          )})) * sin(radians("latitude"::double precision))
        )
      ) AS distance
      FROM "property"
      WHERE "isDeleted" = false
      ${distanceFilter}
      ORDER BY distance ASC
      LIMIT ${limit}
      OFFSET ${skip};
`;

    const data: any = await prisma.$queryRaw(rawQuery);

    const total = await prisma.property.count({
      where: whereConditions,
    });

    return {
      meta: {
        total,
        page,
        limit,
      },
      data,
    };
  }

  const result = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.property.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const ListingService = {
  addPropertyIntoDB,
  getAllPropertiesFromDB,
};
