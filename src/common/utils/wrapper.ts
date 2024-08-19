import { RequestHandler } from "express";

export const wrapper = (requestHandler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
