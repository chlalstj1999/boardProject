import { Request, Response, NextFunction } from "express";
import connectMongoDB from "../database/mongodb";
import { InternalServerErrorException } from "../exception/InternalServerErrorException";

const logRequests = async (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  res.send = (body?: any[]) => {
    res.locals.responseBody = body;
    return originalSend.call(res, body);
  };

  res.on("finish", async () => {
    try {
      const db = await connectMongoDB();
      const collection = db.collection("logs");

      const logEntry = {
        user: req.session.accountIdx || "anonymous",
        apiName: req.originalUrl,
        requestBody: req.body,
        responseData: res.locals.responseBody,
        statusCode: res.statusCode,
        createdAt: new Date(),
      };

      await collection.insertOne(logEntry);
      console.log(logEntry);
    } catch (err) {
      throw new InternalServerErrorException("error saving log");
    }
  });

  next();
};

export default logRequests;
