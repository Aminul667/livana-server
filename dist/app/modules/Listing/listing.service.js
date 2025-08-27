"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const listing_utils_1 = require("./listing.utils");
const listing_constants_1 = require("./listing.constants");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const addPropertyIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user) {
        throw new Error("User information is missing.");
    }
    const imageFiles = req.files;
    if (!((_a = imageFiles === null || imageFiles === void 0 ? void 0 : imageFiles.images) === null || _a === void 0 ? void 0 : _a.length)) {
        throw new Error("At least one image is required.");
    }
    const uploadedImagePaths = imageFiles.images.map((img) => img.path) || [];
    const userId = req.user.userId;
    const { availableFrom, hasParking, hasLift, hasBalcony, heating, cooling, petFriendly, internetIncluded, } = req.body;
    const coverImage = uploadedImagePaths[0];
    const { availableMonth, availableMonthNumber } = (0, listing_utils_1.extractMonthInfo)(availableFrom);
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
    const propertyData = Object.assign(Object.assign({ userId }, req.body), { coverImage,
        availableMonth,
        availableMonthNumber,
        amenities });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const property = yield tx.property.create({
            data: propertyData,
        });
        const imageData = uploadedImagePaths.map((path) => ({
            propertyId: property.id,
            url: path,
        }));
        yield tx.propertyImage.createMany({
            data: imageData,
        });
        return property;
    }));
    return result;
});
const getAllPropertiesFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { limit, page, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const _b = filters, { searchTerm, minBedrooms, maxBedrooms, minMonthlyRent, maxMonthlyRent, lat, lon, maxDistanceMeters, status } = _b, rest = __rest(_b, ["searchTerm", "minBedrooms", "maxBedrooms", "minMonthlyRent", "maxMonthlyRent", "lat", "lon", "maxDistanceMeters", "status"]);
    const sortBy = options.sortBy && listing_constants_1.ALLOWED_SORT_FIELDS.has(options.sortBy)
        ? options.sortBy
        : undefined;
    const sortOrder = options.sortOrder === "desc" ? "desc" : "asc";
    // common non-geo filter conditions
    const andConditions = [
        { isDeleted: false },
        { status: client_1.ListingStatus.published }, // enforce published
    ];
    if (searchTerm) {
        andConditions.push({
            OR: listing_constants_1.listingSearchableFields.map((field) => ({
                [field]: { contains: searchTerm, mode: "insensitive" },
            })),
        });
    }
    if (minBedrooms || maxBedrooms) {
        andConditions.push({
            bedrooms: Object.assign(Object.assign({}, (minBedrooms ? { gte: Number(minBedrooms) } : {})), (maxBedrooms ? { lte: Number(maxBedrooms) } : {})),
        });
    }
    if (minMonthlyRent || maxMonthlyRent) {
        andConditions.push({
            price: Object.assign(Object.assign({}, (minMonthlyRent ? { gte: Number(minMonthlyRent) } : {})), (maxMonthlyRent ? { lte: Number(maxMonthlyRent) } : {})),
        });
    }
    // equality filters (already coerced by Zod)
    Object.entries(rest).forEach(([k, v]) => {
        if (v !== undefined && v !== null && k !== "isDeleted" && k !== "status") {
            andConditions.push({ [k]: { equals: v } });
        }
    });
    const whereConditions = andConditions.length
        ? { AND: andConditions }
        : {};
    const hasGeo = typeof lat === "number" &&
        typeof lon === "number" &&
        !Number.isNaN(lat) &&
        !Number.isNaN(lon);
    // for geo mode with latitude and longitude
    if (hasGeo) {
        const latNum = Number(lat);
        const lonNum = Number(lon);
        const hasRadius = typeof maxDistanceMeters === "number" && maxDistanceMeters >= 0;
        const radiusKm = hasRadius ? maxDistanceMeters / 1000 : null;
        // collect equals from whereConditions (plus hard filters)
        const equalityClauses = [
            client_1.Prisma.sql `p."isDeleted" = false`,
            client_1.Prisma.sql `p."status" = ${client_1.ListingStatus.published}::"ListingStatus"`,
        ];
        const wc = whereConditions;
        const andList = Array.isArray(wc.AND)
            ? wc.AND
            : wc.AND
                ? [wc.AND]
                : [];
        for (const cond of andList) {
            for (const [key, val] of Object.entries(cond)) {
                if (key === "isDeleted" || key === "status")
                    continue;
                if (val && typeof val === "object" && "equals" in val) {
                    equalityClauses.push(client_1.Prisma.sql `p."${client_1.Prisma.raw(key)}" = ${val.equals}`);
                }
            }
        }
        const eqFilter = equalityClauses.length > 0
            ? client_1.Prisma.sql `AND ${client_1.Prisma.join(equalityClauses, " AND ")}`
            : client_1.Prisma.empty;
        const searchFilter = searchTerm
            ? client_1.Prisma.sql `AND (${client_1.Prisma.join(listing_constants_1.listingSearchableFields.map((f) => client_1.Prisma.sql `p."${client_1.Prisma.raw(f)}" ILIKE ${"%" + searchTerm + "%"}`), " OR ")})`
            : client_1.Prisma.empty;
        const bedroomsFilter = minBedrooms || maxBedrooms
            ? client_1.Prisma.sql `AND p."bedrooms" >= ${Number(minBedrooms !== null && minBedrooms !== void 0 ? minBedrooms : Number.MIN_SAFE_INTEGER)}
                      AND p."bedrooms" <= ${Number(maxBedrooms !== null && maxBedrooms !== void 0 ? maxBedrooms : Number.MAX_SAFE_INTEGER)}`
            : client_1.Prisma.empty;
        const priceFilter = minMonthlyRent || maxMonthlyRent
            ? client_1.Prisma.sql `AND p."price" >= ${Number(minMonthlyRent !== null && minMonthlyRent !== void 0 ? minMonthlyRent : 0)}
                      AND p."price" <= ${Number(maxMonthlyRent !== null && maxMonthlyRent !== void 0 ? maxMonthlyRent : 9999999999)}`
            : client_1.Prisma.empty;
        // optional bounding box only when radius is used
        let bboxFilter = client_1.Prisma.empty;
        if (hasRadius) {
            const degPerKmLat = 1 / 111.0;
            const deltaLat = radiusKm * degPerKmLat;
            const rad = (latNum * Math.PI) / 180;
            const cosLat = Math.cos(rad);
            const degPerKmLon = 1 / (111.32 * (Math.abs(cosLat) < 1e-9 ? 1e-9 : cosLat));
            const deltaLon = radiusKm * degPerKmLon;
            const minLat = latNum - deltaLat;
            const maxLat = latNum + deltaLat;
            const minLon = lonNum - deltaLon;
            const maxLon = lonNum + deltaLon;
            bboxFilter = client_1.Prisma.sql `
        AND p."latitude" BETWEEN ${minLat} AND ${maxLat}
        AND p."longitude" BETWEEN ${minLon} AND ${maxLon}
      `;
        }
        // ORDER: distance first, then (optional) sortBy field
        const orderBySql = sortBy
            ? client_1.Prisma.sql `ORDER BY distance_km ASC, d."${client_1.Prisma.raw(sortBy)}" ${client_1.Prisma.raw(sortOrder)}`
            : client_1.Prisma.sql `ORDER BY distance_km ASC`;
        const selectedColumns = client_1.Prisma.sql `
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
        const raw = client_1.Prisma.sql `
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
        ${hasRadius
            ? client_1.Prisma.sql `WHERE d.distance_km <= ${radiusKm}`
            : client_1.Prisma.empty}
        ${orderBySql}
      )
      SELECT *
      FROM ranked
      LIMIT ${limit} OFFSET ${skip};
`;
        const rows = yield prisma_1.default.$queryRaw(raw);
        const total = ((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total_rows) ? Number(rows[0].total_rows) : 0;
        const data = rows.map((_a) => {
            var { total_rows, distance_km } = _a, rest = __rest(_a, ["total_rows", "distance_km"]);
            return (Object.assign(Object.assign({}, rest), { distanceKm: Math.round(distance_km * 100) / 100, distanceMeters: Math.round(distance_km * 1000) }));
        });
        return { meta: { total, page, limit }, data };
    }
    console.log("sortBy", sortBy);
    console.log("sortOrder", sortOrder);
    // non-geo result
    const result = yield prisma_1.default.property.findMany({
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
    const total = yield prisma_1.default.property.count({ where: whereConditions });
    return { meta: { total, page, limit }, data: result };
});
const getPropertyByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const property = yield prisma_1.default.property.findFirst({
        where: {
            id,
            isDeleted: false,
            status: client_1.ListingStatus.published,
        },
        include: {
            images: {
                select: {
                    id: true,
                    url: true,
                },
            },
            user: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
            },
        },
    });
    return property;
});
const getAllDraftPropertiesFromDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new Error("User information is missing.");
    }
    const userId = req.user.userId;
    const result = prisma_1.default.property.findMany({
        where: { userId, isDeleted: false },
    });
    return result;
});
const getDraftByIdFromDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new Error("User information is missing.");
    }
    const { userId } = req.user;
    const { id } = req.params;
    const result = yield prisma_1.default.property.findFirst({
        where: {
            userId,
            id,
            isDeleted: false,
        },
        include: {
            images: {
                select: {
                    id: true,
                    url: true,
                },
            },
            user: {
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
            },
        },
    });
    return result;
});
exports.ListingService = {
    addPropertyIntoDB,
    getAllPropertiesFromDB,
    getPropertyByIdFromDB,
    getAllDraftPropertiesFromDB,
    getDraftByIdFromDB,
};
