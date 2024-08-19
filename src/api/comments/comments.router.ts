import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
// import { csrfProtection } from "../../..";

const commentRouter = Router();

commentRouter.post(
  "/",
  // csrfProtection,
  wrapper(
    controller.commentController.addComment.bind(controller.commentController)
  )
);
commentRouter.get(
  "/",
  wrapper(
    controller.commentController.getComments.bind(controller.commentController)
  )
);
commentRouter.put(
  "/:commentIdx",
  // csrfProtection,
  wrapper(
    controller.commentController.putComment.bind(controller.commentController)
  )
);
commentRouter.delete(
  "/:commentIdx",
  // csrfProtection,
  wrapper(
    controller.commentController.deleteComment.bind(
      controller.commentController
    )
  )
);
commentRouter.put(
  "/:commentIdx/like",
  // csrfProtection,
  wrapper(
    controller.commentController.commentLike.bind(controller.commentController)
  )
);

export default commentRouter;
