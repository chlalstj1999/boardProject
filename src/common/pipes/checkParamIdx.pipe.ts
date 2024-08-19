import { BadRequestException } from "../../common/exception/BadRequestException";
import { Request, Response, NextFunction } from "express";

export function checkParamIdx(params: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      params.forEach((paramName) => {
        const paramsIdx = req.params[paramName];

        if (typeof paramsIdx !== "number") {
          throw new BadRequestException(`${paramName}값이 안 옴`);
        }
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}
