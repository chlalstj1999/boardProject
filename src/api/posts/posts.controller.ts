import { Request, Response, NextFunction } from "express";
import { PostService } from "./posts.service";
import { PostDto } from "./dto/post.dto";
import isRegxMatch from "../../common/pipes/checkRegx.pipe";
import { regx } from "../../common/const/regx";
import { CategoryDto } from "../categorys/dto/category.dto";
import { checkQueryIdx } from "../../common/pipes/checkQueryIdx.pipe";
import { checkParamIdx } from "../../common/pipes/checkParamIdx.pipe";
import { BadRequestException } from "../../common/exception/BadRequestException";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { bucketName } from "../../common/const/environment";
import { s3 } from "../../common/const/s3Client";

export class PostController {
  constructor(private readonly postService: PostService) {}

  async getPostLists(req: Request, res: Response, next: NextFunction) {
    const categoryIdx = checkQueryIdx(["categoryIdx", req.query.categoryIdx]);

    const postDto = new PostDto({
      categoryIdx: categoryIdx,
    });

    const categoryDto = new CategoryDto({
      categoryIdx: postDto.categoryIdx,
    });

    const posts = await this.postService.selectPostLists(postDto, categoryDto);

    res.status(200).send(posts);
  }

  async addPost(req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    let accountIdx;

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);

      const validNewAccessToken = await verifyToken(res.locals.accessToken);

      accountIdx = validNewAccessToken.accountIdx;
    } else {
      accountIdx = validAccessToken.accountIdx;
    }

    isRegxMatch([
      ["title", regx.postTitleRegx],
      ["content", regx.postContentRegx],
    ])(req, res, next);

    const postDto = new PostDto({
      accountIdx: accountIdx,
      categoryIdx: req.body.categoryIdx,
      title: req.body.title,
      content: req.body.content,
      likes: 0,
      imageUrls: req.body.imageUrls,
    });

    const categoryDto = new CategoryDto({
      categoryIdx: postDto.categoryIdx,
    });

    await this.postService.createPost(postDto, categoryDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async getPost(req: Request, res: Response, next: NextFunction) {
    const postDto = new PostDto({
      postIdx: checkParamIdx(["postIdx", req.params.postIdx]),
    });

    const post = await this.postService.selectPost(postDto);

    res.status(200).send(post);
  }

  async putPost(req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    let accountIdx;

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);

      const validNewAccessToken = await verifyToken(res.locals.accessToken);

      accountIdx = validNewAccessToken.accountIdx;
    } else {
      accountIdx = validAccessToken.accountIdx;
    }

    isRegxMatch([
      ["title", regx.postTitleRegx],
      ["content", regx.postContentRegx],
    ])(req, res, next);

    const originalImageUrls = req.body.originalImageUrls as Array<string>;

    if (originalImageUrls.length !== 0) {
      const keys = await Promise.all(
        originalImageUrls.map((imgUrl) => {
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

    const postDto = new PostDto({
      accountIdx: accountIdx,
      postIdx: checkParamIdx(["postIdx", req.params.postIdx]),
      title: req.body.title,
      content: req.body.content,
      imageUrls: req.body.imageUrls,
    });

    await this.postService.updatePost(postDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    let accountIdx;

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);

      const validNewAccessToken = await verifyToken(res.locals.accessToken);

      accountIdx = validNewAccessToken.accountIdx;
    } else {
      accountIdx = validAccessToken.accountIdx;
    }

    const originalImageUrls = req.body.originalImageUrls as Array<string>;

    if (originalImageUrls.length !== 0) {
      const keys = await Promise.all(
        originalImageUrls.map((imgUrl) => {
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

    const postDto = new PostDto({
      accountIdx: accountIdx,
      postIdx: checkParamIdx(["postIdx", req.params.postIdx]),
    });

    await this.postService.deletePost(postDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async postLike(req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    let accountIdx;

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);

      const validNewAccessToken = await verifyToken(res.locals.accessToken);

      accountIdx = validNewAccessToken.accountIdx;
    } else {
      accountIdx = validAccessToken.accountIdx;
    }

    const postDto = new PostDto({
      accountIdx: accountIdx,
      postIdx: checkParamIdx(["postIdx", req.params.postIdx]),
    });

    await this.postService.updatePostLike(postDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async addImages(req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);
    }

    const images = req.files as Express.MulterS3.File[];

    if (!images || images.length === 0) {
      throw new BadRequestException("이미지가 존재하지 않음");
    }

    const path = await Promise.all(
      images.map((img) => {
        return img.location;
      })
    );

    if (typeof res.locals.accessToken !== undefined) {
      res
        .status(200)
        .send({ accessToken: res.locals.accessToken, imageUrls: path });
    } else {
      res.status(200).send({ imageUrls: path });
    }
  }
}
