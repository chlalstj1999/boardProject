import { Router } from "express";
import { wrapper } from "../../common/utils/wrapper";
import { controller } from "../index.controller";
// import { csrfProtection } from "../../..";

const userRouter = Router();

userRouter.post(
  "/",
  wrapper(controller.userController.signUp.bind(controller.userController))
);
userRouter.post(
  "/login",
  wrapper(controller.userController.login.bind(controller.userController))
);
// userRouter.delete(
//   "/logout",
//   // csrfProtection,
//   wrapper(controller.userController.logout.bind(controller.userController))
// );
userRouter.get(
  "/id",
  wrapper(controller.userController.getId.bind(controller.userController))
);
userRouter.get(
  "/pw",
  wrapper(controller.userController.getPw.bind(controller.userController))
);
userRouter.get(
  "/",
  // csrfProtection,
  wrapper(
    controller.userController.getUsersInfo.bind(controller.userController)
  )
);
userRouter.get(
  "/me",
  // csrfProtection,
  wrapper(controller.userController.getUserInfo.bind(controller.userController))
);
userRouter.put(
  "/:userIdx/auth",
  // csrfProtection,
  wrapper(controller.userController.updateAuth.bind(controller.userController))
);
userRouter.put(
  "/me",
  // csrfProtection,
  wrapper(
    controller.userController.updateUserInfo.bind(controller.userController)
  )
);
userRouter.delete(
  "/me",
  // csrfProtection,
  wrapper(controller.userController.withdrawal.bind(controller.userController))
);

export default userRouter;
