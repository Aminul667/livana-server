import { NextFunction, Request, RequestHandler, Response } from "express";

// higher order function which takes one function as input and return another function
const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsync;
