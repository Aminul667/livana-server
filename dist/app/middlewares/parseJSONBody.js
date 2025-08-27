"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSONBody = void 0;
const parseJSONBody = (field = "data") => {
    return (req, res, next) => {
        try {
            if (req.body && typeof req.body[field] === "string") {
                req.body = JSON.parse(req.body[field]);
            }
            next();
        }
        catch (err) {
            next(new Error("Invalid JSON format in request body."));
        }
    };
};
exports.parseJSONBody = parseJSONBody;
