import { Router } from "express";
import { wrapper } from "../../common/module/wrapper";
import { UserController } from "./users.controller";

const userRouter = Router();

userRouter.post("/", wrapper(UserController.signUp));
// userRouter.post("/login", wrapper(UserController.login));
// userRouter.delete("logout", wrapper(UserController.logout));
// userRouter.get("/id", wrapper(UserController.getId));
// userRouter.get("/pw", wrapper(UserController.getPw));
// userRouter.get("/", wrapper(UserController.getUsersInfo));
// userRouter.get("/me", wrapper(UserController.getUserInfo));
// userRouter.put("/:userIdx/auth", wrapper(UserController.updateAuth));
// userRouter.put("/me", wrapper(UserController.updateUserInfo));
// userRouter.delete("/me", wrapper(UserController.withdrawal));

export default userRouter;
