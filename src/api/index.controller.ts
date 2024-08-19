import { AuthController } from "./auth/auth.controller";
import { CategorysController } from "./categorys/categorys.controller";
import { CommentController } from "./comments/comments.controller";
import { service } from "./index.Service";
import { PostController } from "./posts/posts.controller";
import { UserController } from "./users/users.controller";

const authController = new AuthController();
const userController = new UserController(service.userService, authController);
const categoryController = new CategorysController(
  service.categoryService,
  authController
);
const postController = new PostController(service.postService, authController);
const commentController = new CommentController(
  service.commentService,
  authController
);

export const controller = {
  authController,
  userController,
  categoryController,
  postController,
  commentController,
};
