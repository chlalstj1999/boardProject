import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exception/UnauthorizedException";
import jwt from "jsonwebtoken";
import { jwtaccessSecretKey } from "../const/environment";

export async function verifyToken() {
  return function (req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization;

    if (!accessTokenHeader) {
      throw new UnauthorizedException("access token header is missing");
    }

    let accessTokenValid = false;

    jwt.verify(accessTokenHeader, jwtaccessSecretKey, (err, decoded) => {
      if (err) {
        accessTokenValid = false;
      } else {
        accessTokenValid = true;
      }
    });

    if (!accessTokenValid) {
      res.locals.valid = false;
      next();
    } else {
      const accessTokenPayload = jwt.verify(
        accessTokenHeader,
        jwtaccessSecretKey
      ) as jwt.JwtPayload;

      res.locals.valid = true;
      res.locals.accountIdx = accessTokenPayload.accountIdx;
      res.locals.roleIdx = accessTokenPayload.roleIdx;
      next();
    }
  };
}
