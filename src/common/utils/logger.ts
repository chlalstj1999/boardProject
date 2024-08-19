import { Request, Response, NextFunction } from "express";
import { connectMongoDB } from "../database/mongodb";
import { jwtaccessSecretKey } from "../const/environment";
import jwt from "jsonwebtoken";
import { InternalServerErrorException } from "../exception/InternalServerErrorException";

const logRequests = async (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  // res: 응답에서 들어오는 데이터 읽기 스트림
  res.send = (body?: any[]) => {
    res.locals.responseBody = body;
    return originalSend.call(res, body);
  };

  // 특정 이벤트에 대해 리스너 등록
  res.on("finish", async () => {
    try {
      const client = await connectMongoDB();

      const accessTokenHeader = req.headers.authorization!;

      const logEntry = {
        user: "anonymous",
        apiName: req.originalUrl,
        requestBody: req.body,
        responseData: res.locals.responseBody,
        statusCode: res.statusCode,
        createdAt: new Date(),
      };

      if (req.headers.authorization) {
        try {
          const accessTokenPayload = jwt.verify(
            accessTokenHeader,
            jwtaccessSecretKey
          ) as jwt.JwtPayload;

          logEntry.user = accessTokenPayload.accountIdx;
        } catch (err) {
          logEntry.user = "anonymous";
        }
      }

      await client.db("board").collection("logs").insertOne(logEntry);
    } catch (err) {
      throw new InternalServerErrorException("saving log error");
    }
  });

  next();
};

export default logRequests;
