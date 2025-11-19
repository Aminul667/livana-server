import { ListingStatus, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IAuthRequest } from "../User/user.interface";
import { extractMonthInfo } from "./listing.utils";
import {
  ALLOWED_SORT_FIELDS,
  FEATURE_LABELS,
  listingSearchableFields,
} from "./listing.constants";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {
  TFeaturesAndAmenities,
  TListingDetails,
  TLocationDetails,
  TPropertyFor,
  TRentalDetails,
} from "./listing.interface";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

// const addPropertyIntoDB = async (req: IAuthRequest) => {
//   if (!req.user) {
//     throw new Error("User information is missing.");
//   }

//   const imageFiles = req.files as { images: Express.Multer.File[] };

//   if (!imageFiles?.images?.length) {
//     throw new Error("At least one image is required.");
//   }

//   const uploadedImagePaths = imageFiles.images.map((img) => img.path) || [];

//   const userId = req.user.userId;
//   const {
//     availableFrom,
//     hasParking,
//     hasLift,
//     hasBalcony,
//     heating,
//     cooling,
//     petFriendly,
//     internetIncluded,
//   } = req.body;

//   const coverImage = uploadedImagePaths[0];
//   const { availableMonth, availableMonthNumber } =
//     extractMonthInfo(availableFrom);

//   const amenitiesObject = {
//     hasParking,
//     hasLift,
//     hasBalcony,
//     heating,
//     cooling,
//     petFriendly,
//     internetIncluded,
//   };

//   const amenities = Object.entries(amenitiesObject)
//     .filter(([_, value]) => value)
//     .map(([key]) => key);

//   const propertyData = {
//     userId,
//     ...req.body,
//     coverImage,
//     availableMonth,
//     availableMonthNumber,
//     amenities,
//   };

//   const result = await prisma.$transaction(async (tx) => {
//     const property = await tx.property.create({
//       data: propertyData,
//     });

//     const imageData = uploadedImagePaths.map((path) => ({
//       propertyId: property.id,
//       url: path,
//     }));

//     await tx.propertyImage.createMany({
//       data: imageData,
//     });

//     return property;
//   });

//   return result;
// };

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
    maxDistanceMeters,
    status,
    ...rest
  } = filters as Record<string, any>;

  const sortBy =
    options.sortBy && ALLOWED_SORT_FIELDS.has(options.sortBy)
      ? options.sortBy
      : undefined;

  const sortOrder: "asc" | "desc" =
    options.sortOrder === "desc" ? "desc" : "asc";

  // common non-geo filter conditions
  const andConditions: Prisma.PropertyWhereInput[] = [
    { isDeleted: false },
    { status: ListingStatus.published }, // enforce published
  ];

  if (searchTerm) {
    andConditions.push({
      OR: listingSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  if (minBedrooms || maxBedrooms) {
    andConditions.push({
      bedrooms: {
        ...(minBedrooms ? { gte: Number(minBedrooms) } : {}),
        ...(maxBedrooms ? { lte: Number(maxBedrooms) } : {}),
      },
    });
  }

  if (minMonthlyRent || maxMonthlyRent) {
    andConditions.push({
      price: {
        ...(minMonthlyRent ? { gte: Number(minMonthlyRent) } : {}),
        ...(maxMonthlyRent ? { lte: Number(maxMonthlyRent) } : {}),
      },
    });
  }

  // equality filters (already coerced by Zod)
  Object.entries(rest).forEach(([k, v]) => {
    if (v !== undefined && v !== null && k !== "isDeleted" && k !== "status") {
      andConditions.push({ [k]: { equals: v } } as any);
    }
  });

  const whereConditions: Prisma.PropertyWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const hasGeo =
    typeof lat === "number" &&
    typeof lon === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lon);

  // for geo mode with latitude and longitude
  if (hasGeo) {
    const latNum = Number(lat);
    const lonNum = Number(lon);

    const hasRadius =
      typeof maxDistanceMeters === "number" && maxDistanceMeters >= 0;
    const radiusKm = hasRadius ? maxDistanceMeters! / 1000 : null;

    // collect equals from whereConditions (plus hard filters)
    const equalityClauses: Prisma.Sql[] = [
      Prisma.sql`p."isDeleted" = false`,
      Prisma.sql`p."status" = ${ListingStatus.published}::"ListingStatus"`,
    ];

    const wc = whereConditions as Prisma.PropertyWhereInput;
    const andList: Prisma.PropertyWhereInput[] = Array.isArray(wc.AND)
      ? (wc.AND as Prisma.PropertyWhereInput[])
      : wc.AND
      ? [wc.AND as Prisma.PropertyWhereInput]
      : [];

    for (const cond of andList) {
      for (const [key, val] of Object.entries(cond as Record<string, any>)) {
        if (key === "isDeleted" || key === "status") continue;
        if (val && typeof val === "object" && "equals" in val) {
          equalityClauses.push(
            Prisma.sql`p."${Prisma.raw(key)}" = ${val.equals}`
          );
        }
      }
    }

    const eqFilter =
      equalityClauses.length > 0
        ? Prisma.sql`AND ${Prisma.join(equalityClauses, " AND ")}`
        : Prisma.empty;

    const searchFilter = searchTerm
      ? Prisma.sql`AND (${Prisma.join(
          listingSearchableFields.map(
            (f) =>
              Prisma.sql`p."${Prisma.raw(f)}" ILIKE ${"%" + searchTerm + "%"}`
          ),
          " OR "
        )})`
      : Prisma.empty;

    const bedroomsFilter =
      minBedrooms || maxBedrooms
        ? Prisma.sql`AND p."bedrooms" >= ${Number(
            minBedrooms ?? Number.MIN_SAFE_INTEGER
          )}
                      AND p."bedrooms" <= ${Number(
                        maxBedrooms ?? Number.MAX_SAFE_INTEGER
                      )}`
        : Prisma.empty;

    const priceFilter =
      minMonthlyRent || maxMonthlyRent
        ? Prisma.sql`AND p."price" >= ${Number(minMonthlyRent ?? 0)}
                      AND p."price" <= ${Number(
                        maxMonthlyRent ?? 9_999_999_999
                      )}`
        : Prisma.empty;

    // optional bounding box only when radius is used
    let bboxFilter: Prisma.Sql = Prisma.empty;
    if (hasRadius) {
      const degPerKmLat = 1 / 111.0;
      const deltaLat = radiusKm! * degPerKmLat;

      const rad = (latNum * Math.PI) / 180;
      const cosLat = Math.cos(rad);
      const degPerKmLon =
        1 / (111.32 * (Math.abs(cosLat) < 1e-9 ? 1e-9 : cosLat));
      const deltaLon = radiusKm! * degPerKmLon;

      const minLat = latNum - deltaLat;
      const maxLat = latNum + deltaLat;
      const minLon = lonNum - deltaLon;
      const maxLon = lonNum + deltaLon;

      bboxFilter = Prisma.sql`
        AND p."latitude" BETWEEN ${minLat} AND ${maxLat}
        AND p."longitude" BETWEEN ${minLon} AND ${maxLon}
      `;
    }

    // ORDER: distance first, then (optional) sortBy field
    const orderBySql = sortBy
      ? Prisma.sql`ORDER BY distance_km ASC, d."${Prisma.raw(
          sortBy
        )}" ${Prisma.raw(sortOrder)}`
      : Prisma.sql`ORDER BY distance_km ASC`;

    const selectedColumns = Prisma.sql`
      p.id,
      p."listingType",
      p."propertyType",
      p.address,
      p.city,
      p.state,
      p.country,
      p.description,
      p.price,
      p.bedrooms,
      p.bathrooms,
      p."areaSqFt",
      p."coverImage",
      p.latitude,
      p.longitude,
      p."isFeatured",
      p.status
`;
    // Build the geo query
    const raw = Prisma.sql`
      WITH filtered AS (
        SELECT
          ${selectedColumns}
        FROM "property" p
        WHERE p."latitude" IS NOT NULL
          AND p."longitude" IS NOT NULL
          AND p."isDeleted" = false
          AND p."status" = 'published'
          ${eqFilter}
          ${searchFilter}
          ${bedroomsFilter}
          ${priceFilter}
          ${bboxFilter}
      ),
      distanced AS (
        SELECT
          f.*,
          (6371 * acos(
            cos(radians(${latNum}))
            * cos(radians(f."latitude"))
            * cos(radians(f."longitude") - radians(${lonNum}))
            + sin(radians(${latNum})) * sin(radians(f."latitude"))
          )) AS distance_km
        FROM filtered f
      ),
      ranked AS (
        SELECT
          d.*,
          COUNT(*) OVER() AS total_rows
        FROM distanced d
        ${
          hasRadius
            ? Prisma.sql`WHERE d.distance_km <= ${radiusKm}`
            : Prisma.empty
        }
        ${orderBySql}
      )
      SELECT *
      FROM ranked
      LIMIT ${limit} OFFSET ${skip};
`;

    const rows = await prisma.$queryRaw<any[]>(raw);
    const total = rows[0]?.total_rows ? Number(rows[0].total_rows) : 0;

    const data = rows.map(({ total_rows, distance_km, ...rest }) => ({
      ...rest,
      distanceKm: Math.round(distance_km * 100) / 100,
      distanceMeters: Math.round(distance_km * 1000),
    }));

    return { meta: { total, page, limit }, data };
  }

  console.log("sortBy", sortBy);
  console.log("sortOrder", sortOrder);

  // non-geo result
  const result = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder } // safe due to whitelist above
      : { createdAt: "desc" },
    select: {
      id: true,
      listingType: true,
      propertyType: true,
      address: true,
      city: true,
      state: true,
      country: true,
      description: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      areaSqFt: true,
      coverImage: true,
      isFeatured: true,
      status: true,
    },
  });

  const total = await prisma.property.count({ where: whereConditions });

  return { meta: { total, page, limit }, data: result };
};

// const getPropertyByIdFromDB = async (id: string) => {
//   const property = await prisma.property.findFirst({
//     where: {
//       id,
//       isDeleted: false,
//       status: ListingStatus.published,
//     },
//     include: {
//       images: {
//         select: {
//           id: true,
//           url: true,
//         },
//       },
//       user: {
//         select: {
//           id: true,
//           email: true,
//           profile: {
//             select: {
//               id: true,
//               firstName: true,
//               lastName: true,
//               phone: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return property;
// };

const getAllDraftPropertiesFromDB = async (req: IAuthRequest) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const userId = req.user.userId;

  const result = prisma.property.findMany({
    where: { userId, isDeleted: false },
  });

  return result;
};

// const getDraftByIdFromDB = async (req: IAuthRequest) => {
//   if (!req.user) {
//     throw new Error("User information is missing.");
//   }

//   const { userId } = req.user;
//   const { id } = req.params;

//   const result = await prisma.property.findFirst({
//     where: {
//       userId,
//       id,
//       isDeleted: false,
//     },
//     include: {
//       images: {
//         select: {
//           id: true,
//           url: true,
//         },
//       },
//       user: {
//         select: {
//           id: true,
//           email: true,
//           profile: {
//             select: {
//               id: true,
//               firstName: true,
//               lastName: true,
//               phone: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return result;
// };

// multi step
const savePropertyIntoDB = async (userId: string, payload: TPropertyFor) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const propertyData = {
    userId: existingUser.id,
    ...payload,
  };

  const result = await prisma.$transaction(async (tx) => {
    const listing = await tx.listing.create({
      data: propertyData,
      select: { id: true, listingType: true, createdAt: true, updatedAt: true },
    });

    await tx.listingProgress.create({
      data: { listingId: listing.id, currentStep: 1, isCompleted: false },
    });

    return listing;
  });

  return result;
};

const addListingDetailsIntoDB = async (
  payload: TListingDetails,
  userId: string,
  listingId: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
  }

  const currentStep = await prisma.listingProgress.findUnique({
    where: { listingId },
  });

  const { availableFrom } = payload;

  const { availableMonth, availableMonthNumber } =
    extractMonthInfo(availableFrom);

  const updatedPayload = {
    ...payload,
    availableMonth,
    availableMonthNumber,
  };

  const resultData = await prisma.$transaction(async (tx) => {
    const details = await tx.listing.update({
      where: { id: listingId },
      data: updatedPayload,
      select: {
        id: true,
        bedrooms: true,
        bathrooms: true,
        areaSqFt: true,
        floorNumber: true,
        totalFloors: true,
        furnished: true,
        availableFrom: true,
        availableMonth: true,
        availableMonthNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (currentStep && currentStep.currentStep < 2) {
      await tx.listingProgress.update({
        where: { listingId },
        data: {
          currentStep: 2,
          isCompleted: false,
        },
      });
    }

    return details;
  });

  return resultData;
};

const addLocationDetailsIntoDB = async (
  payload: TLocationDetails,
  userId: string,
  listingId: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
  }

  const currentStep = await prisma.listingProgress.findUnique({
    where: { listingId },
  });

  const result = await prisma.$transaction(async (tx) => {
    const locationDetails = await tx.listing.update({
      where: { id: listingId },
      data: payload,
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (currentStep && currentStep.currentStep < 3) {
      await tx.listingProgress.update({
        where: { listingId },
        data: {
          currentStep: 3,
          isCompleted: false,
        },
      });
    }

    return locationDetails;
  });

  return result;
};

const addFeaturesAndAmenitiesIntoDB = async (
  payload: TFeaturesAndAmenities,
  userId: string,
  listingId: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
  }

  const currentStep = await prisma.listingProgress.findUnique({
    where: { listingId },
  });

  let amenitiesList: string[] = [];
  if (payload) {
    amenitiesList = Object.entries(payload)
      .filter(([_, value]) => value)
      .map(([key]) => FEATURE_LABELS[key as keyof typeof FEATURE_LABELS]);
  }

  const updatedAmenities = {
    ...payload,
    amenities: amenitiesList,
  };

  const result = await prisma.$transaction(async (tx) => {
    const features = await tx.listing.update({
      where: { id: listingId },
      data: updatedAmenities,
      select: {
        id: true,
        hasParking: true,
        hasLift: true,
        hasBalcony: true,
        heating: true,
        cooling: true,
        petFriendly: true,
        internetIncluded: true,
        amenities: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (currentStep && currentStep.currentStep < 4) {
      await tx.listingProgress.update({
        where: { listingId },
        data: {
          currentStep: 4,
          isCompleted: true,
        },
      });
    }

    return features;
  });

  return result;
};

const addRentalDetailsIntoDB = async (
  payload: TRentalDetails,
  userId: string,
  listingId: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
  }

  const currentStep = await prisma.listingProgress.findUnique({
    where: { listingId },
  });

  const result = await prisma.$transaction(async (tx) => {
    const rentalDetails = await tx.listing.update({
      where: { id: listingId },
      data: payload,
      select: {
        id: true,
        monthlyRent: true,
        weeklyRent: true,
        rentFrequency: true,
        depositAmount: true,
        maintenanceFee: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (currentStep && currentStep.currentStep < 5) {
      await tx.listingProgress.update({
        where: { listingId },
        data: {
          currentStep: 5,
          isCompleted: true,
        },
      });
    }

    return rentalDetails;
  });

  return result;
};

const addListingMediaIntoDB = async (req: IAuthRequest) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const listingId = req.params.id;
  const videoUrl = req.body.data.videoUrl;
  const imageFiles = req.files as { images: Express.Multer.File[] };

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
  }

  if (!imageFiles?.images?.length) {
    throw new Error("At least one image is required.");
  }

  const currentStep = await prisma.listingProgress.findUnique({
    where: { listingId },
  });

  const uploadedImagePaths = imageFiles.images.map((img) => img.path) || [];
  const coverImage = uploadedImagePaths[0];

  const imageData = uploadedImagePaths.map((path) => ({
    listingId,
    url: path,
  }));

  const result = await prisma.$transaction(async (tx) => {
    await tx.listing.update({
      where: { id: listingId },
      data: { coverImage, videoUrl },
    });

    await tx.propertyImage.createMany({
      data: imageData,
    });

    if (currentStep && currentStep.currentStep < 6) {
      await tx.listingProgress.update({
        where: { listingId },
        data: {
          currentStep: 6,
          isCompleted: true,
        },
      });
    }

    return imageData;
  });

  return result;
};

export const ListingService = {
  // addPropertyIntoDB,
  getAllPropertiesFromDB,
  // getPropertyByIdFromDB,
  getAllDraftPropertiesFromDB,
  // getDraftByIdFromDB,
  savePropertyIntoDB,
  addListingDetailsIntoDB,
  addLocationDetailsIntoDB,
  addFeaturesAndAmenitiesIntoDB,
  addRentalDetailsIntoDB,
  addListingMediaIntoDB,
};
