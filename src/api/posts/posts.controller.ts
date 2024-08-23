import { Request, Response, NextFunction } from "express";
import { PostService } from "./posts.service";
import { PostDto } from "./dto/post.dto";
import { CategoryDto } from "../categorys/dto/category.dto";
import { BadRequestException } from "../../common/exception/BadRequestException";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { bucketName } from "../../common/const/environment";
import { s3 } from "../../common/const/s3Client";

interface IPostController {
  getPostLists(req: Request, res: Response, next: NextFunction): Promise<void>;
  addPost(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPost(req: Request, res: Response, next: NextFunction): Promise<void>;
  putPost(req: Request, res: Response, next: NextFunction): Promise<void>;
  deletePost(req: Request, res: Response, next: NextFunction): Promise<void>;
  postLike(req: Request, res: Response, next: NextFunction): Promise<void>;
  addImages(req: Request, res: Response, next: NextFunction): void;
}
export class PostController implements IPostController {
  constructor(private readonly postService: PostService) {}

  async getPostLists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const categoryIdx = Number(req.query.categoryIdx);

    const postDto = new PostDto({
      categoryIdx: categoryIdx,
    });

    const categoryDto = new CategoryDto({
      categoryIdx: postDto.categoryIdx,
    });

    const posts = await this.postService.selectPostLists(postDto, categoryDto);

    res.status(200).send(posts);
  }

  async addPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const postDto = new PostDto({
      accountIdx: res.locals.accountIdx,
      categoryIdx: req.body.categoryIdx,
      title: req.body.title,
      content: req.body.content,
      likes: 0,
      imageUrls: req.body.imageUrls,
    });

    const categoryDto = new CategoryDto({
      categoryIdx: postDto.categoryIdx,
    });

    try {
      await this.postService.createPost(postDto, categoryDto);

      if (typeof res.locals.accessToken === "undefined") {
        res.status(200).send();
      } else {
        res.status(200).send({ accessToken: res.locals.accessToken });
      }
    } catch (err) {
      if (postDto.imageUrls?.length !== 0) {
        await this.deleteImages(postDto.imageUrls!);
      }
      next(err);
    }
  }

  async getPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const postDto = new PostDto({
      postIdx: Number(req.params.postIdx),
    });

    const post = await this.postService.selectPost(postDto);

    res.status(200).send(post);
  }

  async putPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const deleteImageUrls = req.body.deleteImageUrls as Array<string>;

    if (deleteImageUrls.length !== 0) {
      await this.deleteImages(deleteImageUrls);
    }

    const postDto = new PostDto({
      accountIdx: res.locals.accountIdx,
      postIdx: Number(req.params.postIdx),
      title: req.body.title,
      content: req.body.content,
      imageUrls: req.body.imageUrls,
    });

    await this.postService.updatePost(postDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken });
    }
  }

  async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const postDto = new PostDto({
      accountIdx: res.locals.accountIdx,
      postIdx: Number(req.params.postIdx),
    });

    await this.postService.deletePost(postDto);
    if (postDto.imageUrls?.length !== 0) {
      await this.deleteImages(postDto.imageUrls!);
    }

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken });
    }
  }

  async postLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const postDto = new PostDto({
      accountIdx: res.locals.accountIdx,
      postIdx: Number(req.params.postIdx),
    });

    await this.postService.updatePostLike(postDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken });
    }
  }

  addImages(req: Request, res: Response, next: NextFunction): void {
    const images = req.files as Express.MulterS3.File[];

    if (!images || images.length === 0) {
      throw new BadRequestException("이미지가 존재하지 않음");
    }

    const path = images.map((img) => {
      return img.location;
    });

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send({ imageUrls: path });
    } else {
      res
        .status(200)
        .send({ accessToken: res.locals.accessToken, imageUrls: path });
    }
  }

  async deleteImages(deleteImageUrls: string[]) {
    if (deleteImageUrls.length !== 0) {
      const keys = await Promise.all(
        deleteImageUrls.map((imgUrl) => {
          return { Key: imgUrl.split("/").slice(-1)[0] };
        })
      );

      const command = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: keys,
        },
      });

      await s3.send(command);
    }
  }
}
