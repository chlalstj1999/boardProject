import { UserRepository } from "./users/dao/user.dao";
import { CategoryRepository } from "./categorys/dao/category.dao";
import { PostRepository } from "./posts/dao/post.dao";
import { CommentRepository } from "./comments/dao/comment.dao";
import pool from "../common/database/postgre";

const userRepository = new UserRepository(pool);
const categoryRepository = new CategoryRepository(pool);
const postRepository = new PostRepository(pool);
const commentRepository = new CommentRepository(pool);

export const repository = {
  userRepository,
  categoryRepository,
  postRepository,
  commentRepository,
};
