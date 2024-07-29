import { Request, Response, NextFunction } from "express";
import { SignUpDto } from "./dto/SignUp.dto";
import { UserService } from "./users.service";
import { LoginDto } from "./dto/login.dto";
import { FindIdDto } from "./dto/findId.dto";
import { FindPwDto } from "./dto/findPw.dto";
import { InternalServerErrorException } from "../../common/exception/InternalServerErrorException";
import { PutUserInfoDto } from "./dto/putUserInfo";
import { CheckRolePipe } from "../pipes/checkRole.pipe";
import { CheckLoginPipe } from "../pipes/checkLogin.pipe";
import { CheckParamIdxPipe } from "../pipes/checkParamIdx.pipe";

export class UserController {
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    const signUpDto = new SignUpDto({
      userName: req.body.userName,
      idValue: req.body.idValue,
      pwValue: req.body.pwValue,
      email: req.body.email,
      gender: req.body.gender,
      birth: req.body.birth,
    });

    await SignUpDto.checkSignUpDto(signUpDto);

    await UserService.createUser(signUpDto);

    res.status(200).send();
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    const loginDto = new LoginDto({
      idValue: req.body.idValue,
      pwValue: req.body.pwValue,
    });

    await LoginDto.checkLoginDto(loginDto);

    const user = await UserService.selectUser(loginDto);

    req.session.accountIdx = user.accountIdx;
    req.session.roleIdx = user.roleIdx;
    res.status(200).send();
  };

  static logout = async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException("logout failed");
      }

      res.status(200).send();
    });
  };

  static getId = async (req: Request, res: Response, next: NextFunction) => {
    const findIdDto = new FindIdDto({
      userName: req.body.userName,
      email: req.body.email,
    });

    await FindIdDto.checkFindIdDto(findIdDto);

    const user = await UserService.selectId(findIdDto);

    res.status(200).send(user);
  };

  static getPw = async (req: Request, res: Response, next: NextFunction) => {
    const findPwDto = new FindPwDto({
      userName: req.body.userName,
      idValue: req.body.idValue,
    });

    await FindPwDto.checkFindPwDto(findPwDto);

    const user = await UserService.selectPw(findPwDto);

    res.status(200).send(user);
  };

  static getUsersInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const accountIdx = req.session.accountIdx;
    const roleIdx = req.session.roleIdx;

    CheckLoginPipe.checkLogin(accountIdx);
    CheckRolePipe.checkRole(roleIdx);

    const usersInfo = await UserService.selectUsersInfo();

    res.status(200).send(usersInfo);
  };

  static getUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const accountIdx = req.session.accountIdx;
    const validateAccountIdx = CheckLoginPipe.checkLogin(accountIdx);

    const usersInfo = await UserService.selectUserInfo(validateAccountIdx);

    res.status(200).send(usersInfo);
  };

  static updateAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const accountIdx = req.session.accountIdx;
    const roleIdx = req.session.roleIdx;

    CheckLoginPipe.checkLogin(accountIdx);
    CheckRolePipe.checkRole(roleIdx);
    const userIdx = CheckParamIdxPipe.checkParamIdx("userIdx");

    await UserService.updateAuth(userIdx);

    res.status(200).send();
  };

  static updateUserInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const accountIdx = req.session.accountIdx;

    const validateAccountIdx = CheckLoginPipe.checkLogin(accountIdx);

    const putUserInfoDto = new PutUserInfoDto({
      accountIdx: validateAccountIdx,
      userName: req.body.userName,
      email: req.body.email,
      gender: req.body.gender,
      birth: req.body.birth,
    });

    await PutUserInfoDto.checkSignUpDto(putUserInfoDto);

    await UserService.updatUserInfo(putUserInfoDto);

    res.status(200).send();
  };

  static withdrawal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const accountIdx = req.session.accountIdx;
    const validateAccountIdx = CheckLoginPipe.checkLogin(accountIdx);

    const usersInfo = await UserService.deleteUser(validateAccountIdx);

    res.status(200).send(usersInfo);
  };
}
