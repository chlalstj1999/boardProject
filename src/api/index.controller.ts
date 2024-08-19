import { CategorysController } from "./categorys/categorys.controller";
import { CommentController } from "./comments/comments.controller";
import { service } from "./index.Service";
import { PostController } from "./posts/posts.controller";
import { UserController } from "./users/users.controller";

const userController = new UserController(service.userService);
const categoryController = new CategorysController(service.categoryService);
const postController = new PostController(service.postService);
const commentController = new CommentController(service.commentService);

export const controller = {
  userController,
  categoryController,
  postController,
  commentController,
};
