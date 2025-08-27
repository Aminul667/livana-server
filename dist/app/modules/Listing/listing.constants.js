"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_SORT_FIELDS = exports.listingFilterableFields = exports.listingSearchableFields = void 0;
exports.listingSearchableFields = [
    "address",
    "city",
    "state",
    "country",
];
exports.listingFilterableFields = [
    "searchTerm",
    "listingType",
    "propertyType",
    "purpose",
    "furnished",
    "minMonthlyRent",
    "maxMonthlyRent",
    "minBedrooms",
    "maxBedrooms",
    "availableMonth",
    "availableMonthNumber",
    "rentFrequency",
    "hasParking",
    "hasLift",
    "hasBalcony",
    "heating",
    "cooling",
    "petFriendly",
    "internetIncluded",
    "lat",
    "lon",
    "maxDistanceMeters",
];
exports.ALLOWED_SORT_FIELDS = new Set(["price", "bedrooms", "createdAt"]);
