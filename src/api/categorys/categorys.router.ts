import { Router } from "express";
import { wrapper } from "../../common/module/wrapper";
import { CategorysController } from "./categorys.controller";

const router = Router();

router.post("/", wrapper(CategorysController.addCategory));
router.get("/", wrapper(CategorysController.getCategorys));
router.put("/:categoryIdx", wrapper(CategorysController.putCategory));
router.delete("/:categoryIdx", wrapper(CategorysController.deleteCategory));

export default router;
