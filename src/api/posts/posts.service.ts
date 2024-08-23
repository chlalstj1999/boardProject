import { Pool } from "pg";
import { PostRepository } from "./dao/post.dao";
import { PostDto } from "./dto/post.dto";
import { ConflictException } from "../../common/exception/ConflictException";
import { NotFoundException } from "../../common/exception/NotFoundException";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";
import { CategoryRepository } from "../categorys/dao/category.dao";
import { CategoryDto } from "../categorys/dto/category.dto";

interface IPostService {
  selectPostLists(postDto: PostDto, categoryDto: CategoryDto): Promise<{}[]>;
  createPost(postDto: PostDto, categoryDto: CategoryDto): Promise<void>;
  selectPost(postDto: PostDto): Promise<{}>;
  updatePost(postDto: PostDto): Promise<void>;
  deletePost(postDto: PostDto): Promise<void>;
  updatePostLike(postDto: PostDto): Promise<void>;
}

export class PostService implements IPostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly pool: Pool
  ) {}

  async selectPostLists(
    postDto: PostDto,
    categoryDto: CategoryDto
  ): Promise<{}[]> {
    const category = await this.categoryRepository.selectByIdx(
      categoryDto,
      this.pool
    );
    if (category.length === 0) {
      throw new NotFoundException("해당 카테고리가 존재하지 않음");
    }

    return await this.postRepository.getPostLists(postDto, this.pool);
  }

  async createPost(postDto: PostDto, categoryDto: CategoryDto): Promise<void> {
    const category = await this.categoryRepository.selectByIdx(
      categoryDto,
      this.pool
    );
    if (category.length === 0) {
      throw new NotFoundException("해당 카테고리가 존재하지 않음");
    }

    const post = await this.postRepository.getPostByTitle(postDto, this.pool);
    if (post.length !== 0) {
      throw new ConflictException("같은 제목이 존재함");
    }

    await this.postRepository.addPost(postDto, this.pool);
  }

  async selectPost(postDto: PostDto): Promise<{}> {
    await this.postRepository.isPost(postDto, this.pool);
    if (typeof postDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 게시물이 존재하지 않음");
    }

    return await this.postRepository.getPost(postDto, this.pool);
  }

  async updatePost(postDto: PostDto): Promise<void> {
    await this.postRepository.isPost(postDto, this.pool);
    if (typeof postDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 게시물이 존재하지 않음");
    }

    if (postDto.accountIdx !== postDto.authorIdx) {
      throw new UnauthorizedException("해당 작성자만 가능");
    }

    const postDuplicate = await this.postRepository.getPostByTitleExIdx(
      postDto,
      this.pool
    );

    if (postDuplicate.length !== 0) {
      throw new ConflictException("같은 제목이 존재함");
    }

    await this.postRepository.isImageTable(postDto, this.pool);

    postDto.isSameImage = false;

    if (postDto.imageUrls?.length === postDto.originalImageUrls?.length) {
      for (let i = 0; i < postDto.imageUrls!.length; i++) {
        if (postDto.imageUrls![i] !== postDto.originalImageUrls![i]) {
          postDto.isSameImage = false;
        } else {
          postDto.isSameImage = true;
        }
      }
    }

    await this.postRepository.putPost(postDto, this.pool);
  }

  async deletePost(postDto: PostDto): Promise<void> {
    await this.postRepository.isPost(postDto, this.pool);
    if (typeof postDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 게시물이 존재하지 않음");
    }

    if (postDto.accountIdx !== postDto.authorIdx) {
      throw new UnauthorizedException("해당 작성자만 가능");
    }

    await this.postRepository.isImageTable(postDto, this.pool);

    await this.postRepository.deletePost(postDto, this.pool);
  }

  async updatePostLike(postDto: PostDto): Promise<void> {
    await this.postRepository.isPost(postDto, this.pool);
    if (typeof postDto.authorIdx === "undefined") {
      throw new NotFoundException("해당 게시물이 존재하지 않음");
    }

    const isPostLike = await this.postRepository.getIsPostLike(
      postDto,
      this.pool
    );
    if (isPostLike.length === 0) {
      await this.postRepository.addPostLike(postDto, this.pool);
    } else {
      await this.postRepository.deletePostLike(postDto, this.pool);
    }
  }
}
