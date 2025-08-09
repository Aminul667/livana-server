export const listingSearchableFields: string[] = [
  "address",
  "city",
  "state",
  "country",
  // "description",
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

// export const numericFieldCandidates = [
//   "minMonthlyRent",
//   "maxMonthlyRent",
//   "minBedrooms",
//   "maxBedrooms",
//   "availableMonthNumber",
//   "lat",
//   "lon",
//   "maxDistance",
//   "maxDistanceMeters",
//   "page",
//   "limit",
// ] as const;

// Which numeric fields should be integers?
// export const integerFields: ReadonlySet<string> = new Set([
//   "minBedrooms",
//   "maxBedrooms",
//   "availableMonthNumber",
//   "page",
//   "limit",
// ]);

// export const booleanFields = [
//   "hasParking",
//   "hasLift",
//   "hasBalcony",
//   "heating",
//   "cooling",
//   "petFriendly",
//   "internetIncluded",
// ];
