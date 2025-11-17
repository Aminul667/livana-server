// src/modules/listing/listing.query.schema.ts
import z from "zod";
import {
  FurnishedStatus,
  ListingType,
  PropertyType,
  Purpose,
  RentFrequency,
} from "@prisma/client";
import {
  optionalBooleanish,
  optionalInt,
  optionalNumber,
} from "../../../helpers/zodHelpers";

// Helper: Prisma enum -> z.enum of its string values (since nativeEnum is deprecated in v4)
const zFromPrismaEnum = <T extends string>(e: Record<string, T>) =>
  z.enum(Object.values(e) as [T, ...T[]]);

// Optional trimmed string that becomes undefined if empty
const optionalTrimmedString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().optional()
);

// Optional: control allowed sort fields
const sortByEnum = z.enum(["createdAt", "price", "bedrooms"]).optional();
const sortOrderEnum = z.enum(["asc", "desc"]).optional();

export const listQuerySchema = z
  .object({
    // search + enums
    searchTerm: optionalTrimmedString,
    listingType: zFromPrismaEnum(ListingType).optional(),
    propertyType: zFromPrismaEnum(PropertyType).optional(),
    purpose: zFromPrismaEnum(Purpose).optional(),
    furnished: zFromPrismaEnum(FurnishedStatus).optional(),
    rentFrequency: zFromPrismaEnum(RentFrequency).optional(),

    // numeric ranges
    minMonthlyRent: optionalNumber,
    maxMonthlyRent: optionalNumber,
    minBedrooms: optionalInt,
    maxBedrooms: optionalInt,

    // availability
    availableMonth: optionalTrimmedString,
    availableMonthNumber: optionalInt,

    // booleans
    hasParking: optionalBooleanish,
    hasLift: optionalBooleanish,
    hasBalcony: optionalBooleanish,
    heating: optionalBooleanish,
    cooling: optionalBooleanish,
    petFriendly: optionalBooleanish,
    internetIncluded: optionalBooleanish,

    // geo
    lat: optionalNumber,
    lon: optionalNumber,
    maxDistance: optionalNumber, // km (legacy)
    maxDistanceMeters: optionalNumber, // meters (preferred)

    // pagination/sort
    page: optionalInt.default(1),
    limit: optionalInt.default(20),
    sortBy: sortByEnum,
    sortOrder: sortOrderEnum,
  })
  .strict()
  .superRefine((v, ctx) => {
    if (
      v.minBedrooms != null &&
      v.maxBedrooms != null &&
      v.minBedrooms > v.maxBedrooms
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minBedrooms"],
        message: "minBedrooms cannot be greater than maxBedrooms",
      });
    }
    if (
      v.minMonthlyRent != null &&
      v.maxMonthlyRent != null &&
      v.minMonthlyRent > v.maxMonthlyRent
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["minMonthlyRent"],
        message: "minMonthlyRent cannot be greater than maxMonthlyRent",
      });
    }
  });

// If you want km→meters auto-derivation, use this instead when mounting middleware:
export const listQuerySchemaWithDerived = listQuerySchema.transform((v) => ({
  ...v,
  maxDistanceMeters:
    v.maxDistanceMeters ??
    (typeof v.maxDistance === "number" ? v.maxDistance * 1000 : undefined),
}));

export const listingTypeSchema = z.object({
  body: z.object({
    listingType: zFromPrismaEnum(ListingType).refine(
      (val) => val === ListingType.rent || val === ListingType.sale,
      { message: "Listing Type must be either 'rent' or 'sale'" }
    ),
  }),
});

export const listingDetailsValidationSchema = z.object({
  body: z.object({
    bedrooms: z.number().positive("bedrooms must be greater than 0"),
    bathrooms: z.number().positive("bathrooms must be greater than 0"),
    areaSqFt: z.number().positive("size must be greater than 0"),
    floorNumber: z.number().positive("floorNumber must be greater than 0"),
    totalFloors: z
      .number()
      .positive("totalFloors must be greater than 0")
      .optional(),
    furnished: zFromPrismaEnum(FurnishedStatus),
    availableFrom: z.string().refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: "Invalid date format for availableFrom",
    }),
  }),
});

export const locationDetailsValidationSchema = z.object({
  body: z.object({
    address: z.string().min(1, "address is required"),
    city: z.string().min(1, "city is required"),
    state: z.string().min(1, "state is required"),
    postalCode: z.string().min(1, "postalCode is required"),
    country: z.string().min(1, "country is required"),
    latitude: z
      .number()
      .min(-90)
      .max(90, "latitude must be between -90 and 90"),
    longitude: z
      .number()
      .min(-180)
      .max(180, "longitude must be between -180 and 180"),
  }),
});
