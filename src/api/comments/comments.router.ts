import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
import { checkVerifyToken } from "../../common/pipes/checkVerifyToken.pipe";
import isRegxMatch from "../../common/pipes/checkRegx.pipe";
import { regx } from "../../common/const/regx";
import { checkParamIdx } from "../../common/pipes/checkParamIdx.pipe";

const commentRouter = Router();

commentRouter.post(
  "/",
  checkVerifyToken(),
  isRegxMatch([["comment", regx.commentRegx]]),
  wrapper(
    controller.commentController.addComment.bind(controller.commentController)
  )
);
commentRouter.get(
  "/",
  checkParamIdx(["postIdx"]),
  wrapper(
    controller.commentController.getComments.bind(controller.commentController)
  )
);
commentRouter.put(
  "/:commentIdx",
  checkVerifyToken(),
  isRegxMatch([["comment", regx.commentRegx]]),
  wrapper(
    controller.commentController.putComment.bind(controller.commentController)
  )
);
commentRouter.delete(
  "/:commentIdx",
  checkVerifyToken(),
  checkParamIdx(["commentIdx"]),
  wrapper(
    controller.commentController.deleteComment.bind(
      controller.commentController
    )
  )
);
commentRouter.put(
  "/:commentIdx/like",
  checkVerifyToken(),
  checkParamIdx(["commentIdx"]),
  wrapper(
    controller.commentController.commentLike.bind(controller.commentController)
  )
);

export default commentRouter;
