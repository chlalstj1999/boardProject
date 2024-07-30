import { Request, Response, NextFunction } from "express";
import { PostService } from "./posts.service";
import { CheckQueryIdxPipe } from "../pipes/checkQueryIdx.pipe";
import { CheckLoginPipe } from "../pipes/checkLogin.pipe";
import { AddPostDto } from "./dto/addPos.dto";

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
}
