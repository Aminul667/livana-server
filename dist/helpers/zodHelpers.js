"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalInt = exports.optionalNumber = exports.optionalBooleanish = exports.booleanish = void 0;
// src/helpers/zodHelpers.ts
const zod_1 = __importDefault(require("zod"));
// bool: supports true/false/1/0/yes/no/on/off
exports.booleanish = zod_1.default
    .union([zod_1.default.boolean(), zod_1.default.string(), zod_1.default.number()])
    .transform((v) => {
    if (typeof v === "boolean")
        return v;
    if (typeof v === "number")
        return v !== 0;
    const s = v.trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(s))
        return true;
    if (["false", "0", "no", "n", "off"].includes(s))
        return false;
    throw new Error("Invalid boolean");
});
exports.optionalBooleanish = exports.booleanish.optional();
const toNumber = (v) => {
    if (v === "" || v === undefined || v === null)
        return undefined;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isNaN(n))
        throw new Error("Invalid number");
    return n;
};
exports.optionalNumber = zod_1.default
    .union([zod_1.default.string(), zod_1.default.number()])
    .transform(toNumber)
    .optional();
exports.optionalInt = zod_1.default
    .union([zod_1.default.string(), zod_1.default.number()])
    .transform((v) => {
    const n = toNumber(v);
    if (n === undefined)
        return undefined;
    if (!Number.isInteger(n))
        throw new Error("Expected integer");
    return n;
})
    .optional();
