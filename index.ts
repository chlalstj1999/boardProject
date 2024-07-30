import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import { Exception } from "./src/common/exception/Exception";
import userRouter from "./src/api/users/users.router";
import categoryRouter from "./src/api/categorys/categorys.router";
import logRequests from "./src/common/module/logger";
import postRouter from "./src/api/posts/posts.router";
import commentRouter from "./src/api/comments/comments.router";

const app = express();
const port = 8000;

app.use(express.json());
app.use(
  session({
    secret: "0585d138dc7fbd1f",
    resave: false,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface SessionData {
    accountIdx: number;
    roleIdx: number;
  }
}

app.use(logRequests);

app.use("/users", userRouter);
app.use("/categorys", categoryRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((req, res, next) => {
  next(new Exception(404, "router not Found"));
});

app.use((err: Exception, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(port, () => {
  console.log("8000번 포트에서 실행");
});
