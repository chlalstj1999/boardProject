import { Request, Response, NextFunction } from "express";
import { UserService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/token";
import { googleClientId } from "../../common/const/environment";

interface IUserController {
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  getId(req: Request, res: Response, next: NextFunction): Promise<void>;
  getPw(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUsersInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserInfo(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUserInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  withdrawal(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userDto = new UserDto({
      userName: req.body.userName,
      idValue: req.body.idValue,
      pwValue: req.body.pwValue,
      email: req.body.email,
      gender: req.body.gender,
      birth: req.body.birth,
      roleIdx: 2,
    });

    await this.userService.createUser(userDto);

    res.status(200).send();
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userDto = new UserDto({
      idValue: req.body.idValue,
      pwValue: req.body.pwValue,
    });

    await this.userService.selectUser(userDto);

    const accessToken = generateAccessToken(
      userDto.accountIdx!,
      userDto.roleIdx!
    );
    const refreshToken = generateRefreshToken(
      userDto.accountIdx!,
      userDto.roleIdx!
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 3600 * 24,
      sameSite: "strict",
    });

    res.status(200).send({ accessToken: accessToken });
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.clearCookie("refreshToken");
    res.status(200).send();
  }

  async getId(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userDto = new UserDto({
      userName: req.body.userName,
      email: req.body.email,
    });

    await this.userService.selectId(userDto);

    res.status(200).send({ idValue: userDto.idValue });
  }

  async getPw(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userDto = new UserDto({
      userName: req.body.userName,
      idValue: req.body.idValue,
    });

    await this.userService.selectPw(userDto);

    res.status(200).send({ pwValue: userDto.pwValue });
  }

  async getUsersInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const usersInfo = await this.userService.selectUsersInfo();

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send(usersInfo);
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken, usersInfo });
    }
  }

  async getUserInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userDto = new UserDto({
      accountIdx: res.locals.accountIdx,
    });

    await this.userService.selectUserInfo(userDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send(userDto);
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken, userDto });
    }
  }

  async updateAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userDto = new UserDto({
      accountIdx: res.locals.accountIdx,
      roleIdx: res.locals.roleIdx,
      userIdx: Number(req.params.userIdx),
    });

    await this.userService.updateAuth(userDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken, userDto });
    }
  }

  async updateUserInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userDto = new UserDto({
      accountIdx: res.locals.accountIdx,
      userName: req.body.userName,
      email: req.body.email,
      gender: req.body.gender,
      birth: req.body.birth,
    });

    await this.userService.updatUserInfo(userDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.status(200).send({ accessToken: res.locals.accessToken });
    }
  }

  async withdrawal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userDto = new UserDto({
      accountIdx: res.locals.accountIdx,
    });

    await this.userService.deleteUser(userDto);

    if (typeof res.locals.accessToken === "undefined") {
      res.status(200).send();
    } else {
      res.clearCookie("refreshToken");
      res.status(200).send();
    }
  }
}
