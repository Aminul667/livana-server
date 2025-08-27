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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const listing_service_1 = require("./listing.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const listing_constants_1 = require("./listing.constants");
const addProperty = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_service_1.ListingService.addPropertyIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Listing added successfully!",
        data: result,
    });
}));
const getAllProperties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(res.locals.query, listing_constants_1.listingFilterableFields);
    const options = (0, pick_1.default)(res.locals.query, [
        "limit",
        "page",
        "sortBy",
        "sortOrder",
    ]);
    const result = yield listing_service_1.ListingService.getAllPropertiesFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Listing retrived successfully!",
        data: result,
    });
}));
const getPropertyById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield listing_service_1.ListingService.getPropertyByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Property retrieved successfully!",
        data: result,
    });
}));
const getAllDraftProperties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_service_1.ListingService.getAllDraftPropertiesFromDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Draft property retrieved successfully!",
        data: result,
    });
}));
const getDraftById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield listing_service_1.ListingService.getDraftByIdFromDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Draft property retrieved successfully!",
        data: result,
    });
}));
exports.ListingController = {
    addProperty,
    getAllProperties,
    getPropertyById,
    getAllDraftProperties,
    getDraftById,
};
