import jwt from "jsonwebtoken";
import { jwtaccessSecretKey, jwtRefreshSecretKey } from "../const/environment";

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
