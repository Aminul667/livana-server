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
exports.userService = void 0;
const hashPasswordHelper_1 = require("../../../helpers/hashPasswordHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = payload;
    // Check if email already exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: email },
    });
    if (existingUser) {
        throw new ApiErrors_1.default(http_status_1.default.CONFLICT, "User already exists with this email");
    }
    // Hash the password
    const hashedPassword = yield (0, hashPasswordHelper_1.hashedPasswordHelper)(password);
    // Create admin user
    const createdUser = yield prisma_1.default.user.create({
        data: {
            email: email,
            password: hashedPassword,
            role: role,
        },
    });
    // Return safe user data (omit password)
    return {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        isProfileCompleted: createdUser.isProfileCompleted,
        createdAt: createdUser.createdAt,
    };
});
const updateUserProfileIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user) {
        throw new Error("User information is missing.");
    }
    const { firstName, lastName, phone, location, about } = req.body;
    const userId = req.user.userId;
    const profilePhoto = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || "";
    const profileData = {
        firstName,
        lastName,
        phone,
        location,
        about,
        profilePhoto,
    };
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedProfile = yield tx.profile.upsert({
            where: { userId },
            update: profileData,
            create: Object.assign({ userId }, profileData),
        });
        const user = yield tx.user.update({
            where: { id: userId },
            data: { isProfileCompleted: true },
        });
        return { updatedProfile, user };
    }));
    const dataForToken = {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        isProfileCompleted: result.user.isProfileCompleted,
    };
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(dataForToken, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken(dataForToken, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return { result: result.updatedProfile, accessToken, refreshToken };
});
const getMeFromDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            role: true,
            isProfileCompleted: true,
            profile: {
                select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    location: true,
                    about: true,
                    profilePhoto: true,
                },
            },
        },
    });
    return user;
});
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = prisma_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            profile: {
                select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    location: true,
                    about: true,
                    profilePhoto: true,
                },
            },
        },
    });
    return result;
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findFirst({
        where: { id, isDeleted: false },
        select: {
            id: true,
            email: true,
            role: true,
            profile: {
                select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                    location: true,
                    about: true,
                    profilePhoto: true,
                },
            },
        },
    });
    return result;
});
exports.userService = {
    createUserIntoDB,
    updateUserProfileIntoDB,
    getMeFromDB,
    getAllUsersFromDB,
    getUserByIdFromDB,
};
