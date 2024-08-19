import jwt from "jsonwebtoken";
import { jwtaccessSecretKey, jwtRefreshSecretKey } from "../const/environment";
import { UnauthorizedException } from "../exception/UnauthorizedException";
// import { connectRedis } from "../database/redis";

export function generateAccessToken(accountIdx: number, roleIdx: number) {
  return jwt.sign(
    {
      accountIdx: accountIdx,
      roleIdx: roleIdx,
    },
    jwtaccessSecretKey,
    {
      issuer: "choiminseo",
      expiresIn: "5m",
    }
  );
}

export function generateRefreshToken(accountIdx: number, roleIdx: number) {
  return jwt.sign(
    {
      accountIdx: accountIdx,
      roleIdx: roleIdx,
    },
    jwtRefreshSecretKey,
    {
      issuer: "choiminseo",
      expiresIn: "7d",
    }
  );
}

export async function verifyToken(accessTokenHeader: string) {
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
    return {
      valid: false,
    };
  }
  const accessTokenPayload = jwt.verify(
    accessTokenHeader,
    jwtaccessSecretKey
  ) as jwt.JwtPayload;

  return {
    valid: true,
    accountIdx: accessTokenPayload.accountIdx,
    roleIdx: accessTokenPayload.roleIdx,
  };
}
