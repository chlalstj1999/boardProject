import { Router } from "express";
import { wrapper } from "../../common/module/wrapper";
import { PostController } from "./posts.controller";

const postRouter = Router();

postRouter.get("/list", wrapper(PostController.getPostLists));
postRouter.post("/", wrapper(PostController.addPost));
postRouter.get("/:postIdx", wrapper(PostController.getPost));
postRouter.put("/:postIdx", wrapper(PostController.putPost));
postRouter.delete("/:postIdx", wrapper(PostController.deletePost));
postRouter.put("/:postIdx/like", wrapper(PostController.postLike));

export default postRouter;
