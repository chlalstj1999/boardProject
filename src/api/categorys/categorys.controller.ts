import { Request, Response, NextFunction } from "express";
import { AddCategoryDto } from "./dto/addCategory.dto";
import { CategorysService } from "./categorys.service";
import { CheckLoginPipe } from "../pipes/checkLogin.pipe";
import { CheckRolePipe } from "../pipes/checkRole.pipe";
import { UpdateCategoryDto } from "./dto/updateCategory.dto";
import { CheckParamIdxPipe } from "../pipes/checkParamIdx.pipe";

export class CategorysController {
  static addCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const accountIdx = req.session.accountIdx;
    const roleIdx = req.session.roleIdx;

    CheckLoginPipe.checkLogin(accountIdx);
    CheckRolePipe.checkRole(roleIdx);

    const addCategoryDto = new AddCategoryDto(req.body.categoryName);

    await CategorysService.createCategory(addCategoryDto);

    res.status(200).send();
  };

  static getCategorys = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const categorys = await CategorysService.selectCategorys();

    res.status(200).send(categorys);
  };

  static putCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const categoryIdx = CheckParamIdxPipe.checkParamIdx("cateogryIdx");

    const updateCategoryDto = new UpdateCategoryDto({
      categoryIdx: categoryIdx,
      categoryName: req.body.categoryName,
    });

    await CategorysService.updateCategory(updateCategoryDto);
    res.status(200).send();
  };

  static deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const categoryIdx = CheckParamIdxPipe.checkParamIdx("cateogryIdx");

    await CategorysService.deleteCategory(categoryIdx);
    res.status(200).send();
  };
}
