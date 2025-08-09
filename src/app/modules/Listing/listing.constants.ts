export const listingSearchableFields: string[] = [
  "address",
  "city",
  "state",
  "country",
];

export const listingFilterableFields: string[] = [
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

export const ALLOWED_SORT_FIELDS = new Set(["price", "bedrooms", "createdAt"]);
