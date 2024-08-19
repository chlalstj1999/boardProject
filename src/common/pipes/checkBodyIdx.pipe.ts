import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../common/exception/BadRequestException";

export function checkBodyIdx(params: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      params.forEach((paramName) => {
        const bodyIdx = req.params[paramName];

        if (bodyIdx === `:${paramName}`) {
          throw new BadRequestException(`${paramName}값이 안 옴`);
        }
      });

      next();
    } catch (err) {
      next(err);
    }
  };
}
