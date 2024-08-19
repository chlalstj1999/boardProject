import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
import { upload } from "../../common/utils/s3";

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
  wrapper(
    controller.postController.getPostLists.bind(controller.postController)
  )
);
postRouter.post(
  "/",
  wrapper(controller.postController.addPost.bind(controller.postController))
);
postRouter.get(
  "/:postIdx",
  wrapper(controller.postController.getPost.bind(controller.postController))
);
postRouter.put(
  "/:postIdx",
  wrapper(controller.postController.putPost.bind(controller.postController))
);
postRouter.delete(
  "/:postIdx",
  wrapper(controller.postController.deletePost.bind(controller.postController))
);
postRouter.put(
  "/:postIdx/like",
  wrapper(controller.postController.postLike.bind(controller.postController))
);
postRouter.post(
  "/images",
  upload.array("image", 5),
  wrapper(controller.postController.addImages.bind(controller.postController))
);
export default postRouter;
