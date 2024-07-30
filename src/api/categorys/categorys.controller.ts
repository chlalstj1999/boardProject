import { Request, Response, NextFunction } from "express";
import { AddCategoryDto } from "./dto/addCategory.dto";
import { CategorysService } from "./categorys.service";
import { CheckLoginPipe } from "../pipes/checkLogin.pipe";
import { CheckAdminPipe } from "../pipes/checkAdmin.pipe";
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
    CheckAdminPipe.checkRole(roleIdx);

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
    const accountIdx = req.session.accountIdx;
    const roleIdx = req.session.roleIdx;
    const paramIdx = req.params.categoryIdx;

    CheckLoginPipe.checkLogin(accountIdx);
    CheckAdminPipe.checkRole(roleIdx);

    const categoryIdx = CheckParamIdxPipe.checkParamIdx([
      "categoryIdx",
      paramIdx,
    ]);

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
    const paramIdx = req.params.categoryIdx;
    const categoryIdx = CheckParamIdxPipe.checkParamIdx([
      "categoryIdx",
      paramIdx,
    ]);

    await CategorysService.deleteCategory(categoryIdx);
    res.status(200).send();
  };
}
