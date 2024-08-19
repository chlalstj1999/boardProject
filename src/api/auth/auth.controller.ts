import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";
import jwt from "jsonwebtoken";
import { jwtRefreshSecretKey } from "../../common/const/environment";
import { generateAccessToken } from "../../common/utils/token";

export class AuthController {
  async regenrateAccessToken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException("login again");
    }

    const refreshDecoded = jwt.verify(
      refreshToken,
      jwtRefreshSecretKey
    ) as jwt.JwtPayload;

    const accessToken = generateAccessToken(
      refreshDecoded.accountIdx,
      refreshDecoded.roleIdx
    );

    res.locals.accessToken = accessToken;
  }
}
