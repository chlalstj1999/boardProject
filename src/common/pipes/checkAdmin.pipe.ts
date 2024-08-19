import { Request, Response, NextFunction } from "express";
import { admin } from "../../common/const/role";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";

export function checkAdmin() {
  return function (req: Request, res: Response, next: NextFunction) {
    const roleIdx = res.locals.roleIdx;

    if (Number(roleIdx) !== admin) {
      throw new UnauthorizedException("관리자 권한 필요");
    }
  };
}
