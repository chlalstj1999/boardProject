import { Router } from "express";
import { wrapper } from "../../common/module/wrapper";
import { CommentController } from "./comments.controller";

const commentRouter = Router();

commentRouter.post("/", wrapper(CommentController.addComment));
commentRouter.get("/", wrapper(CommentController.getComments));
commentRouter.put("/:commentIdx", wrapper(CommentController.putComment));
commentRouter.delete("/:commentIdx", wrapper(CommentController.deleteComment));
commentRouter.put("/:commentIdx/like", wrapper(CommentController.commentLike));

export default commentRouter;
