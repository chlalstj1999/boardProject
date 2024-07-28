import { Request, Response, NextFunction } from "express";
import { SignUpDto } from "./dto/SignUp.dto";
import { UserService } from "./users.service";
import { LoginDto } from "./dto/login.dto";

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

    req.session.accountIdx = user.userIdx;
    req.session.roleIdx = user.roleIdx;
    res.status(200).send();
  };
}
