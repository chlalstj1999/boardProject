import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
import { checkVerifyToken } from "../../common/pipes/checkVerifyToken.pipe";
import { checkAdmin } from "../../common/pipes/checkAdmin.pipe";
import isRegxMatch from "../../common/pipes/checkRegx.pipe";
import { regx } from "../../common/const/regx";
import { checkParamIdx } from "../../common/pipes/checkParamIdx.pipe";

const router = Router();

router.post(
  "/",
  checkVerifyToken(),
  checkAdmin(),
  isRegxMatch([["categoryName", regx.categoryNameRegx]]),
  wrapper(
    controller.categoryController.addCategory.bind(
      controller.categoryController
    )
  )
);
router.get(
  "/",
  wrapper(
    controller.categoryController.getCategorys.bind(
      controller.categoryController
    )
  )
);
router.put(
  "/:categoryIdx",
  checkVerifyToken(),
  checkAdmin(),
  isRegxMatch([["categoryName", regx.categoryNameRegx]]),
  checkParamIdx(["categoryIdx"]),
  wrapper(
    controller.categoryController.putCategory.bind(
      controller.categoryController
    )
  )
);
router.delete(
  "/:categoryIdx",
  checkVerifyToken(),
  checkAdmin(),
  checkParamIdx(["categoryIdx"]),
  wrapper(
    controller.categoryController.deleteCategory.bind(
      controller.categoryController
    )
  )
);

export default router;
