import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
import { upload } from "../../common/utils/s3";
import { checkQueryIdx } from "../../common/pipes/checkQueryIdx.pipe";
import { checkVerifyToken } from "../../common/pipes/checkVerifyToken.pipe";
import isRegxMatch from "../../common/pipes/checkRegx.pipe";
import { regx } from "../../common/const/regx";
import { checkParamIdx } from "../../common/pipes/checkParamIdx.pipe";

const postRouter = Router();
// postService
//   .createPost({
//     title: "djWJrn",
//     content: "",
//     accountIdx: 1,
//     categoryIdx: 1,
//   })
//   .then((result) => {
//     if (result === undefined) console.log("fail");
//   })
//   .catch((err) => {
//     if (err instanceof ConflictException) console.log("success");
//   });

postRouter.get(
  "/list",
  checkQueryIdx(["categoryIdx"]),
  wrapper(
    controller.postController.getPostLists.bind(controller.postController)
  )
);
postRouter.post(
  "/",
  checkVerifyToken(),
  isRegxMatch([
    ["title", regx.postTitleRegx],
    ["content", regx.postContentRegx],
  ]),

  wrapper(controller.postController.addPost.bind(controller.postController))
);
postRouter.get(
  "/:postIdx",
  checkParamIdx(["postIdx"]),
  wrapper(controller.postController.getPost.bind(controller.postController))
);
postRouter.put(
  "/:postIdx",
  checkVerifyToken(),
  isRegxMatch([
    ["title", regx.postTitleRegx],
    ["content", regx.postContentRegx],
  ]),
  checkParamIdx(["postIdx"]),
  wrapper(controller.postController.putPost.bind(controller.postController))
);
postRouter.delete(
  "/:postIdx",
  checkVerifyToken(),
  checkParamIdx(["postIdx"]),
  wrapper(controller.postController.deletePost.bind(controller.postController))
);
postRouter.put(
  "/:postIdx/like",
  checkVerifyToken(),
  checkParamIdx(["postIdx"]),
  wrapper(controller.postController.postLike.bind(controller.postController))
);
postRouter.post(
  "/images",
  checkVerifyToken(),
  upload.array("image", 5),
  wrapper(controller.postController.addImages.bind(controller.postController))
);
export default postRouter;
