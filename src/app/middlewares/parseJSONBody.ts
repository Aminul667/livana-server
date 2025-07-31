import { NextFunction, Request, Response } from "express";

export const parseJSONBody = (field: string = "data") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body && typeof req.body[field] === "string") {
        req.body = JSON.parse(req.body[field]);
      }
      next();
    } catch (err) {
      next(new Error("Invalid JSON format in request body."));
    }
  };
};
