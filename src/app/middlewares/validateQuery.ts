// src/middlewares/validateQuery.ts
import { ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

export function validateQuery<S extends ZodObject<ZodRawShape>>(
  schema: S
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const raw = req.query ?? {};
    const cleaned = Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== "" && v !== undefined && v !== null
      )
    );

    const parsed = schema.safeParse(cleaned);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: parsed.error.flatten(),
      });
    }

    res.locals.query = parsed.data;
    next();
  };
}
