import { Request, Response, NextFunction } from "express";
import { BadRequestException } from "../exception/BadRequestException";

const isRegxMatch = (params: [string, RegExp][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    params.forEach(([paramName, paramRegx]) => {
      const value = req.body[paramName];
      if (!value.match(paramRegx)) {
        throw new BadRequestException(`${paramName}의 입력을 확인해야 함`);
      }
    });
  };
};

export default isRegxMatch;
