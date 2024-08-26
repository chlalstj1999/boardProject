import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
import isRegxMatch from "../../common/pipes/checkRegx.pipe";
import { regx } from "../../common/const/regx";
import { checkVerifyToken } from "../../common/pipes/checkVerifyToken.pipe";
import { checkAdmin } from "../../common/pipes/checkAdmin.pipe";
import { checkParamIdx } from "../../common/pipes/checkParamIdx.pipe";

const userRouter = Router();

userRouter.post(
  "/",
  isRegxMatch([
    ["userName", regx.userNameRegx],
    ["idValue", regx.idRegx],
    ["pwValue", regx.pwRegx],
    ["email", regx.emailRegx],
    ["gender", regx.genderRegx],
    ["birth", regx.birthRegx],
  ]),
  wrapper(controller.userController.signUp.bind(controller.userController))
);
userRouter.post(
  "/oauth",
  isRegxMatch([
    ["userName", regx.userNameRegx],
    ["email", regx.emailRegx],
    ["gender", regx.genderRegx],
    ["birth", regx.birthRegx],
  ]),
  wrapper(controller.userController.signUp.bind(controller.userController))
);
userRouter.post(
  "/login",
  isRegxMatch([
    ["idValue", regx.idRegx],
    ["pwValue", regx.pwRegx],
  ]),
  wrapper(controller.userController.login.bind(controller.userController))
);
userRouter.get(
  "/login/google",
  wrapper(controller.userController.googleLogin.bind(controller.userController))
);
userRouter.get(
  "/auth/google/callback",
  wrapper(
    controller.userController.googleOAuthCallback.bind(
      controller.userController
    )
  )
);
userRouter.post(
  "/login/kakao",
  wrapper(controller.userController.kakaoLogin.bind(controller.userController))
);
userRouter.get(
  "/auth/kakao/callback",
  wrapper(
    controller.userController.kakaoOAuthCallback.bind(controller.userController)
  )
);
userRouter.post(
  "/login/naver",
  wrapper(controller.userController.naverLogin.bind(controller.userController))
);
userRouter.get(
  "/auth/naver/callback",
  wrapper(
    controller.userController.naverOAuthCallback.bind(controller.userController)
  )
);
userRouter.delete(
  "/logout",
  checkVerifyToken(),
  wrapper(controller.userController.logout.bind(controller.userController))
);
userRouter.get(
  "/id",
  isRegxMatch([
    ["userName", regx.userNameRegx],
    ["email", regx.emailRegx],
  ]),
  wrapper(controller.userController.getId.bind(controller.userController))
);
userRouter.get(
  "/pw",
  isRegxMatch([
    ["userName", regx.userNameRegx],
    ["idValue", regx.idRegx],
  ]),
  wrapper(controller.userController.getPw.bind(controller.userController))
);
userRouter.get(
  "/",
  checkVerifyToken(),
  checkAdmin(),
  wrapper(
    controller.userController.getUsersInfo.bind(controller.userController)
  )
);
userRouter.get(
  "/me",
  checkVerifyToken(),
  wrapper(controller.userController.getUserInfo.bind(controller.userController))
);
userRouter.put(
  "/:userIdx/auth",
  checkVerifyToken(),
  checkAdmin(),
  checkParamIdx(["userIdx"]),
  wrapper(controller.userController.updateAuth.bind(controller.userController))
);
userRouter.put(
  "/me",
  checkVerifyToken(),
  isRegxMatch([
    ["userName", regx.userNameRegx],
    ["email", regx.emailRegx],
    ["gender", regx.genderRegx],
    ["birth", regx.birthRegx],
  ]),
  wrapper(
    controller.userController.updateUserInfo.bind(controller.userController)
  )
);
userRouter.delete(
  "/me",
  checkVerifyToken(),
  wrapper(controller.userController.withdrawal.bind(controller.userController))
);

export default userRouter;
