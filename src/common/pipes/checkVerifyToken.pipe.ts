import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exception/UnauthorizedException";
import jwt from "jsonwebtoken";
import { jwtaccessSecretKey, jwtRefreshSecretKey } from "../const/environment";
import { generateAccessToken } from "../utils/token";

export function checkVerifyToken() {
  return function (req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;

    if (!accessTokenHeader) {
      throw new UnauthorizedException("access token header is missing");
    }

    if (!refreshToken) {
      throw new UnauthorizedException("login again");
    }

    let accessTokenValid = false;

    jwt.verify(accessTokenHeader, jwtaccessSecretKey, (err, decoded) => {
      if (err) {
        accessTokenValid = false;
      } else {
        accessTokenValid = true;
      }
    });

    let accessTokenPayload;

    if (!accessTokenValid) {
      const refreshDecoded = jwt.verify(
        refreshToken,
        jwtRefreshSecretKey
      ) as jwt.JwtPayload;

      const accessToken = generateAccessToken(
        refreshDecoded.accountIdx,
        refreshDecoded.roleIdx
      );

      accessTokenPayload = jwt.verify(
        accessToken,
        jwtaccessSecretKey
      ) as jwt.JwtPayload;
    } else {
      accessTokenPayload = jwt.verify(
        accessTokenHeader,
        jwtaccessSecretKey
      ) as jwt.JwtPayload;
    }
    res.locals.accountIdx = accessTokenPayload.accountIdx;
    res.locals.roleIdx = accessTokenPayload.roleIdx;
    next();
  };
}
