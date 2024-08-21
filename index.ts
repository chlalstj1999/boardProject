import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import { Exception } from "./src/common/exception/Exception";
import userRouter from "./src/api/users/users.router";
import categoryRouter from "./src/api/categorys/categorys.router";
import logRequests from "./src/common/utils/logger";
import postRouter from "./src/api/posts/posts.router";
import commentRouter from "./src/api/comments/comments.router";
import { NotFoundException } from "./src/common/exception/NotFoundException";
import cookieParser from "cookie-parser";
import { sessionSecret } from "./src/common/const/environment";

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(
//   session({
//     secret: sessionSecret,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// declare module "express-session" {
//   interface SessionData {
//     state: string;
//   }
// }

app.use(logRequests);

app.use("/users", userRouter);
app.use("/categorys", categoryRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((req, res, next) => {
  next(new NotFoundException("router not Found"));
});

app.use((err: Exception, req: Request, res: Response, next: NextFunction) => {
  // 의미가 없는 if 문
  if (err.message === "jwt expired") {
    res.status(401).send({
      message: err.message,
    });
  } else if (err.message === "invalid signature") {
    res.status(401).send({
      message: err.message,
    });
  } else if (err.message === "jwt must be provided") {
    res.status(401).send({
      message: err.message,
    });
  } else {
    res.status(err.statusCode || 500).send(err.message);
  }
});

app.listen(80, () => console.log("Example app listening on port 80!"));
