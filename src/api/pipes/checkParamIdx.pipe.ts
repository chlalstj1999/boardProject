import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../../common/exception/BadRequestException";

export class CheckParamIdxPipe {
  static checkParamIdx = (param: string) => {
    const idx = null;
    (req: Request, res: Response, next: NextFunction) => {
      const idx = req.params[param];

      if (!idx) {
        throw new BadRequestException(`${param}값이 안 옴`);
      }
    };
    return Number(idx);
  };
}
