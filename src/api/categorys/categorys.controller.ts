import { Request, Response, NextFunction } from "express";
import { CategoryDto } from "./dto/category.dto";
import { CategorysService } from "./categorys.service";
import isRegxMatch from "../../common/pipes/checkRegx.pipe";
import { regx } from "../../common/const/regx";
import { checkParamIdx } from "../../common/pipes/checkParamIdx.pipe";

export class CategorysController {
  constructor(private readonly categoryService: CategorysService) {}

  async addCategory(req: Request, res: Response, next: NextFunction) {
    isRegxMatch([["categoryName", regx.categoryNameRegx]])(req, res, next);

    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);

      const validNewAccessToken = await verifyToken(res.locals.accessToken);

      checkRole(validNewAccessToken.roleIdx);
    } else {
      checkRole(validAccessToken.roleIdx);
    }

    const categoryDto = new CategoryDto({
      categoryName: req.body.categoryName,
    });

    await this.categoryService.createCategory(categoryDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async getCategorys(req: Request, res: Response, next: NextFunction) {
    const categorys = await this.categoryService.selectCategorys();

    res.status(200).send(categorys);
  }

  async putCategory(req: Request, res: Response, next: NextFunction) {
    isRegxMatch([["categoryName", regx.categoryNameRegx]])(req, res, next);

    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);
      const validNewAccessToken = await verifyToken(res.locals.accessToken);

      checkRole(validNewAccessToken.roleIdx);
    } else {
      checkRole(validAccessToken.roleIdx);

      const categoryDto = new CategoryDto({
        categoryIdx: checkParamIdx(["categoryIdx", req.params.categoryIdx]),
        categoryName: req.body.categoryName,
      });

      await this.categoryService.updateCategory(categoryDto);
    }

    const categoryDto = new CategoryDto({
      categoryIdx: checkParamIdx(["categoryIdx", req.params.categoryIdx]),
      categoryName: req.body.categoryName,
    });

    await this.categoryService.updateCategory(categoryDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    const accessTokenHeader = req.headers.authorization!;

    const validAccessToken = await verifyToken(accessTokenHeader);

    if (!validAccessToken.valid) {
      await this.authController.regenrateAccessToken(req, res, next);
      const validNewAccessToken = await verifyToken(res.locals.accessToken);

      checkRole(validNewAccessToken.roleIdx);
    } else {
      checkRole(validAccessToken.roleIdx);
    }

    const categoryDto = new CategoryDto({
      categoryIdx: checkParamIdx(["categoryIdx", req.params.categoryIdx]),
    });

    await this.categoryService.deleteCategory(categoryDto);

    if (typeof res.locals.accessToken !== undefined) {
      res.status(200).send({ accessToken: res.locals.accessToken });
    } else {
      res.status(200).send();
    }
  }
}
