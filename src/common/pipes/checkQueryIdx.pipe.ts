import { BadRequestException } from "../../common/exception/BadRequestException";
import { Request, Response, NextFunction } from "express";

export function checkQueryIdx(params: any[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      params.forEach((paramName) => {
        const queryIdx = req.params[paramName];

        if (queryIdx === `:${paramName}`) {
          throw new BadRequestException(`${paramName}값이 안 옴`);
        }
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}
