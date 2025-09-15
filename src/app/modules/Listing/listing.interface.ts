import {
  FurnishedStatus,
  ListingStatus,
  PropertyType,
  Purpose,
  RentFrequency,
} from "@prisma/client";

export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };

export type TProperty = {
  description: string;
  price: number;
  listingType: ListingStatus;
  propertyType: PropertyType;
  purpose: Purpose;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  floorNumber: number;
  totalFloors?: number;
  furnished: FurnishedStatus;
  availableFrom: string;
  rentFrequency?: RentFrequency;
  depositAmount?: number;
  maintenanceFee?: number;
  hasParking: boolean;
  hasLift: boolean;
  hasBalcony: boolean;
  heating: boolean;
  cooling: boolean;
  petFriendly: boolean;
  internetIncluded: boolean;
  videoUrl?: string;
};

export type TPropertyFor = {
  propertyFor: string;
}
