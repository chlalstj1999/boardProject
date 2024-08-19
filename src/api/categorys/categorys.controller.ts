import { Request, Response, NextFunction } from "express";
import { CategoryDto } from "./dto/category.dto";
import { CategorysService } from "./categorys.service";

interface ICategorysController {
  addCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCategorys(req: Request, res: Response, next: NextFunction): Promise<void>;
  putCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}

export class CategorysController implements ICategorysController {
  constructor(private readonly categoryService: CategorysService) {}

  async addCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const categoryDto = new CategoryDto({
      categoryName: req.body.categoryName,
    });

    await this.categoryService.createCategory(categoryDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken });
    }
  }

  async getCategorys(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const categorys = await this.categoryService.selectCategorys();

    res.status(200).send(categorys);
  }

  async putCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const categoryDto = new CategoryDto({
      categoryIdx: Number(req.params.categoryIdx),
      categoryName: req.body.categoryName,
    });

    await this.categoryService.updateCategory(categoryDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken });
    }
  }

  async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const categoryDto = new CategoryDto({
      categoryIdx: Number(req.params.categoryIdx),
    });

    await this.categoryService.deleteCategory(categoryDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken });
    }
  }
}
