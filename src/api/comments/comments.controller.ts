import { Request, Response, NextFunction } from "express";
import { CommentService } from "./comments.service";
import { CommentDto } from "./dto/comment.dto";
import { regx } from "../../common/const/regx";
import isRegxMatch from "../../common/pipes/checkRegx.pipe";
import { PostDto } from "../posts/dto/post.dto";
import { checkParamIdx } from "../../common/pipes/checkParamIdx.pipe";

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  async addComment(req: Request, res: Response, next: NextFunction) {
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
    isRegxMatch([["comment", regx.commentRegx]])(req, res, next);

    const commentDto = new CommentDto({
      accountIdx: accountIdx,
      postIdx: req.body.postIdx,
      comment: req.body.comment,
      likes: 0,
    });

    const postDto = new PostDto({
      postIdx: commentDto.postIdx,
    });

    await this.commentService.createComment(commentDto, postDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction) {
    const commentDto = new CommentDto({
      postIdx: checkParamIdx(["postIdx", req.body.postIdx]),
    });

    const postDto = new PostDto({
      postIdx: commentDto.postIdx,
    });

    const comments = await this.commentService.selectComments(
      commentDto,
      postDto
    );

    res.status(200).send(comments);
  }

  async putComment(req: Request, res: Response, next: NextFunction) {
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

    isRegxMatch([["comment", regx.commentRegx]])(req, res, next);

    const commentDto = new CommentDto({
      accountIdx: accountIdx,
      commentIdx: checkParamIdx(["commentIdx", req.params.commentIdx]),
      comment: req.body.comment,
    });

    await this.commentService.updateComment(commentDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
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

    const commentDto = new CommentDto({
      accountIdx: accountIdx,
      commentIdx: checkParamIdx(["commentIdx", req.params.commentIdx]),
    });

    await this.commentService.deleteComment(commentDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async commentLike(req: Request, res: Response, next: NextFunction) {
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

    const commentDto = new CommentDto({
      accountIdx: accountIdx,
      commentIdx: checkParamIdx(["commentIdx", req.params.commentIdx]),
    });

    await this.commentService.updateCommentLike(commentDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }
}
