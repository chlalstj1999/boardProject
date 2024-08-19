import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";

const authRouter = Router();

authRouter.post(
  "/accessToken",
  wrapper(controller.authController.regenrateAccessToken)
);

export default authRouter;
