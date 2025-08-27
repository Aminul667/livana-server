"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuerySchemaWithDerived = exports.listQuerySchema = void 0;
// src/modules/listing/listing.query.schema.ts
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
const zodHelpers_1 = require("../../../helpers/zodHelpers");
// Helper: Prisma enum -> z.enum of its string values (since nativeEnum is deprecated in v4)
const zFromPrismaEnum = (e) => zod_1.default.enum(Object.values(e));
// Optional trimmed string that becomes undefined if empty
const optionalTrimmedString = zod_1.default.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), zod_1.default.string().trim().optional());
// Optional: control allowed sort fields
const sortByEnum = zod_1.default.enum(["createdAt", "price", "bedrooms"]).optional();
const sortOrderEnum = zod_1.default.enum(["asc", "desc"]).optional();
exports.listQuerySchema = zod_1.default
    .object({
    // search + enums
    searchTerm: optionalTrimmedString,
    listingType: zFromPrismaEnum(client_1.ListingType).optional(),
    propertyType: zFromPrismaEnum(client_1.PropertyType).optional(),
    purpose: zFromPrismaEnum(client_1.Purpose).optional(),
    furnished: zFromPrismaEnum(client_1.FurnishedStatus).optional(),
    rentFrequency: zFromPrismaEnum(client_1.RentFrequency).optional(),
    // numeric ranges
    minMonthlyRent: zodHelpers_1.optionalNumber,
    maxMonthlyRent: zodHelpers_1.optionalNumber,
    minBedrooms: zodHelpers_1.optionalInt,
    maxBedrooms: zodHelpers_1.optionalInt,
    // availability
    availableMonth: optionalTrimmedString,
    availableMonthNumber: zodHelpers_1.optionalInt,
    // booleans
    hasParking: zodHelpers_1.optionalBooleanish,
    hasLift: zodHelpers_1.optionalBooleanish,
    hasBalcony: zodHelpers_1.optionalBooleanish,
    heating: zodHelpers_1.optionalBooleanish,
    cooling: zodHelpers_1.optionalBooleanish,
    petFriendly: zodHelpers_1.optionalBooleanish,
    internetIncluded: zodHelpers_1.optionalBooleanish,
    // geo
    lat: zodHelpers_1.optionalNumber,
    lon: zodHelpers_1.optionalNumber,
    maxDistance: zodHelpers_1.optionalNumber, // km (legacy)
    maxDistanceMeters: zodHelpers_1.optionalNumber, // meters (preferred)
    // pagination/sort
    page: zodHelpers_1.optionalInt.default(1),
    limit: zodHelpers_1.optionalInt.default(20),
    sortBy: sortByEnum,
    sortOrder: sortOrderEnum,
})
    .strict()
    .superRefine((v, ctx) => {
    if (v.minBedrooms != null &&
        v.maxBedrooms != null &&
        v.minBedrooms > v.maxBedrooms) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            path: ["minBedrooms"],
            message: "minBedrooms cannot be greater than maxBedrooms",
        });
    }
    if (v.minMonthlyRent != null &&
        v.maxMonthlyRent != null &&
        v.minMonthlyRent > v.maxMonthlyRent) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            path: ["minMonthlyRent"],
            message: "minMonthlyRent cannot be greater than maxMonthlyRent",
        });
    }
});
// If you want km→meters auto-derivation, use this instead when mounting middleware:
exports.listQuerySchemaWithDerived = exports.listQuerySchema.transform((v) => {
    var _a;
    return (Object.assign(Object.assign({}, v), { maxDistanceMeters: (_a = v.maxDistanceMeters) !== null && _a !== void 0 ? _a : (typeof v.maxDistance === "number" ? v.maxDistance * 1000 : undefined) }));
});
