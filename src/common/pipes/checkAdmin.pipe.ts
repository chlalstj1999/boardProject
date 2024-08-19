import { Request, Response, NextFunction } from "express";
import { admin } from "../../common/const/role";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";

export function checkAdmin() {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const roleIdx = res.locals.roleIdx;

      if (roleIdx !== admin) {
        throw new UnauthorizedException("관리자 권한 필요");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
