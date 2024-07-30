import { Request, Response, NextFunction } from "express";
import { CheckLoginPipe } from "../pipes/checkLogin.pipe";
import { AddCommentDto } from "./dto/addComment.dto";
import { PutCommentDto } from "./dto/putComment.dto";
import { CheckParamIdxPipe } from "../pipes/checkParamIdx.pipe";
import { CommentService } from "./comments.service";

export class CommentController {
  static addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let accountIdx = req.session.accountIdx;
    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    const addCommentDto = new AddCommentDto({
      accountIdx: accountIdx,
      postIdx: req.body.postIdx,
      comment: req.body.comment,
    });
    AddCommentDto.checkAddCommentDto(addCommentDto);

    await CommentService.createComment(addCommentDto);
    res.status(200).send();
  };

  static getComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const postIdx = req.body.postIdx;

    const comments = await CommentService.selectComments(postIdx);

    res.status(200).send(comments);
  };

  static putComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const paramsIdx = req.params.commentIdx;
    const commentIdx = CheckParamIdxPipe.checkParamIdx([
      "commentIdx",
      paramsIdx,
    ]);
    let accountIdx = req.session.accountIdx;
    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    const putCommentDto = new PutCommentDto({
      accountIdx: accountIdx,
      commentIdx: commentIdx,
      comment: req.body.comment,
    });

    PutCommentDto.checkPutCommentDto(putCommentDto);

    await CommentService.updateComment(putCommentDto);

    res.status(200).send();
  };

  static deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const paramsIdx = req.params.commentIdx;
    const commentIdx = CheckParamIdxPipe.checkParamIdx([
      "commentIdx",
      paramsIdx,
    ]);
    let accountIdx = req.session.accountIdx;
    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    await CommentService.deleteComment(accountIdx, commentIdx);

    res.status(200).send();
  };

  static commentLike = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const paramsIdx = req.params.commentIdx;
    const commentIdx = CheckParamIdxPipe.checkParamIdx([
      "commentIdx",
      paramsIdx,
    ]);
    let accountIdx = req.session.accountIdx;
    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    await CommentService.updateCommentLike(accountIdx, commentIdx);

    res.status(200).send();
  };
}
