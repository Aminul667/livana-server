"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = validateQuery;
function validateQuery(schema) {
    return (req, res, next) => {
        var _a;
        const raw = (_a = req.query) !== null && _a !== void 0 ? _a : {};
        const cleaned = Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== "" && v !== undefined && v !== null));
        const parsed = schema.safeParse(cleaned);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid query parameters",
                errors: parsed.error.flatten(),
            });
        }
        res.locals.query = parsed.data; // ✅ stash validated/coerced query here
        next();
    };
}
