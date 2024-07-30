import { Router } from "express";
import { wrapper } from "../../common/module/wrapper";
import { PostController } from "./posts.controller";

const postRouter = Router();

postRouter.get("/list", wrapper(PostController.getPostLists));
postRouter.post("/", wrapper(PostController.addPost));
// postRouter.delete("/:postIdx", wrapper(UserController.logout));
// postRouter.get("/:postIdx", wrapper(UserController.getId));
// postRouter.get("/:postIdx", wrapper(UserController.getPw));
// postRouter.get("/:postIdx/like", wrapper(UserController.getUsersInfo));
// postRouter.get("/me", wrapper(UserController.getUserInfo));

export default postRouter;
