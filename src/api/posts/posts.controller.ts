import { Request, Response, NextFunction } from "express";
import { PostService } from "./posts.service";
import { CheckQueryIdxPipe } from "../pipes/checkQueryIdx.pipe";
import { CheckLoginPipe } from "../pipes/checkLogin.pipe";
import { AddPostDto } from "./dto/addPost.dto";
import { CheckParamIdxPipe } from "../pipes/checkParamIdx.pipe";
import { PutPostDto } from "./dto/putPost.dto";

export class PostController {
  static getPostLists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const QueryIdx = req.query.categoryIdx;

    const categoryIdx = CheckQueryIdxPipe.checkQueryIdx([
      "categoryIdx",
      QueryIdx,
    ]);

    const posts = await PostService.selectPostLists(categoryIdx);

    res.status(200).send(posts);
  };

  static addPost = async (req: Request, res: Response, next: NextFunction) => {
    let accountIdx = req.session.accountIdx;

    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    const addPostDto = new AddPostDto({
      accountIdx: accountIdx,
      categoryIdx: req.body.categoryIdx,
      title: req.body.title,
      content: req.body.content,
    });
    AddPostDto.checkAddPostDto(addPostDto);

    await PostService.createPost(addPostDto);

    res.status(200).send();
  };

  static getPost = async (req: Request, res: Response, next: NextFunction) => {
    const paramsIdx = req.params.postIdx;

    const postIdx = CheckParamIdxPipe.checkParamIdx(["postIdx", paramsIdx]);

    const post = await PostService.selectPost(postIdx);

    res.status(200).send(post);
  };

  static putPost = async (req: Request, res: Response, next: NextFunction) => {
    const paramsIdx = req.params.postIdx;
    const postIdx = CheckParamIdxPipe.checkParamIdx(["postIdx", paramsIdx]);
    let accountIdx = req.session.accountIdx;
    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    const putPostDto = new PutPostDto({
      accountIdx: accountIdx,
      postIdx: postIdx,
      title: req.body.title,
      content: req.body.content,
    });

    PutPostDto.checkPutPostDto(putPostDto);

    await PostService.updatePost(putPostDto);

    res.status(200).send();
  };

  static deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const paramsIdx = req.params.postIdx;
    const postIdx = CheckParamIdxPipe.checkParamIdx(["postIdx", paramsIdx]);
    let accountIdx = req.session.accountIdx;
    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    await PostService.deletePost(accountIdx, postIdx);

    res.status(200).send();
  };

  static postLike = async (req: Request, res: Response, next: NextFunction) => {
    const paramsIdx = req.params.postIdx;
    const postIdx = CheckParamIdxPipe.checkParamIdx(["postIdx", paramsIdx]);
    let accountIdx = req.session.accountIdx;
    accountIdx = CheckLoginPipe.checkLogin(accountIdx);

    await PostService.updatePostLike(accountIdx, postIdx);

    res.status(200).send();
  };
}
