"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJWTIssuedBeforePasswordChanged = void 0;
const isJWTIssuedBeforePasswordChanged = (passwordChangedTimestamp, jwtIssuedTimestamp) => new Date(passwordChangedTimestamp).getTime() / 1000 > jwtIssuedTimestamp;
exports.isJWTIssuedBeforePasswordChanged = isJWTIssuedBeforePasswordChanged;
