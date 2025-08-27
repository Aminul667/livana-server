"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../../config/multer.config");
const listing_controller_1 = require("./listing.controller");
const validateQuery_1 = require("../../middlewares/validateQuery");
const listing_validation_1 = require("./listing.validation");
const router = express_1.default.Router();
router.get("/", (0, validateQuery_1.validateQuery)(listing_validation_1.listQuerySchema), listing_controller_1.ListingController.getAllProperties);
router.get("/draft", (0, auth_1.default)(client_1.UserRole.landlord), listing_controller_1.ListingController.getAllDraftProperties);
router.get("/draft/:id", (0, auth_1.default)(client_1.UserRole.landlord), listing_controller_1.ListingController.getDraftById);
router.get("/:id", listing_controller_1.ListingController.getPropertyById);
router.post("/add", (0, auth_1.default)(client_1.UserRole.landlord), multer_config_1.multerUpload.fields([{ name: "images" }]), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, listing_controller_1.ListingController.addProperty);
exports.ListingRoutes = router;
