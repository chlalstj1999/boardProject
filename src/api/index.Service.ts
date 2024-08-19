import pool from "../common/database/postgre";
import { CategorysService } from "./categorys/categorys.service";
import { CommentService } from "./comments/comments.service";
import { repository } from "./index.Repo";
import { PostService } from "./posts/posts.service";
import { UserService } from "./users/users.service";

const userService = new UserService(repository.userRepository, pool);
const categoryService = new CategorysService(
  repository.categoryRepository,
  pool
);
const postService = new PostService(
  repository.postRepository,
  repository.categoryRepository,
  pool
);
const commentService = new CommentService(
  repository.commentRepository,
  repository.postRepository,
  pool
);

export const service = {
  userService,
  categoryService,
  postService,
  commentService,
};
