import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
// import { csrfProtection } from "../../..";

const router = Router();

router.post(
  "/",
  // csrfProtection,
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
  // csrfProtection,
  wrapper(
    controller.categoryController.putCategory.bind(
      controller.categoryController
    )
  )
);
router.delete(
  "/:categoryIdx",
  // csrfProtection,
  wrapper(
    controller.categoryController.deleteCategory.bind(
      controller.categoryController
    )
  )
);

export default router;
