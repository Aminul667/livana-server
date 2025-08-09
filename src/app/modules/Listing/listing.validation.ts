// src/modules/listing/listing.query.schema.ts
import z from "zod";
import {
  FurnishedStatus,
  ListingStatus,
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
