import { Request, Response, NextFunction } from "express";
import { UserService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/token";
import crypto from "node:crypto";
import { oauth2Client } from "../../common/const/googleOAuthClient";
import {
  googleRedirectUrl,
  kakaoClientId,
  kakaoClientSecret,
  kakaoRedirectUrl,
  naverClientId,
  naverClientSecret,
  naverRedirectUrl,
} from "../../common/const/environment";
import axios from "axios";

interface IUserController {
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  oauthSignUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleOAuthCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
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

interface KakaoPofileNickname {
  nickname: string;
}

interface KakaoAccount {
  email: string;
  profile: KakaoPofileNickname;
}

interface KakaoUserInfoResponse {
  kakao_account: KakaoAccount;
}

interface naverAccount {
  email: string;
  name: string;
}

interface naverUserInfoResponse {
  response: naverAccount;
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

  async oauthSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userDto = new UserDto({
      userName: req.body.userName,
      email: req.body.email,
      gender: req.body.gender,
      birth: req.body.birth,
      roleIdx: 2,
      signUpPath: req.body.signUpPath,
    });

    await this.userService.createUserByOauth(userDto);

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

  async googleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const state = crypto.randomBytes(32).toString("hex");

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
      state: state,
    });

    res.redirect(authorizationUrl);
  }

  async googleOAuthCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authorizationCode = req.query.code as string;

    if (req.query.error === "access_denied") {
      return res.redirect("http://localhost/users/login/google");
    }

    const tokenResponse = await axios.post<{ access_token: string }>(
      "https://oauth2.googleapis.com/token",
      {
        code: authorizationCode,
        client_id: oauth2Client._clientId,
        client_secret: oauth2Client._clientSecret,
        redirect_uri: googleRedirectUrl,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokens = tokenResponse.data;
    oauth2Client.setCredentials(tokens);

    const userInfoResponse = await axios.get<{ name: string; email: string }>(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    await axios.post<{ name: string; email: string }>(
      `https://oauth2.googleapis.com/revoke?token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const googleEmail = userInfoResponse.data.email;
    const userName = userInfoResponse.data.name;

    const userDto = new UserDto({
      userName: userName!,
      email: googleEmail!,
      signUpPath: "google",
    });

    await this.userService.selectUserByEmail(userDto);

    if (typeof userDto.accountIdx === "undefined") {
      return res.redirect(
        `http://localhost/loginPage?userName=${userDto.userName}&email=${userDto.email}&signUpPath=${userDto.signUpPath}`
      );
    } else {
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

      return res.redirect(
        `http://localhost/mainPage?accessToken=${accessToken}`
      );
    }
  }

  async kakaoLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.redirect(
      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUrl}&scope=account_email,profile_nickname&prompt=login`
    );
  }

  async kakaoOAuthCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authorizationCode = req.query.code as string;

    if (req.query.error === "302") {
      return res.redirect("http://localhost/users/login/kakao");
    }

    const tokenResponse = await axios.post<{ access_token: string }>(
      "https://kauth.kakao.com/oauth/token",
      {
        code: authorizationCode,
        client_id: kakaoClientId,
        client_secret: kakaoClientSecret,
        redirect_uri: kakaoRedirectUrl,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokens = tokenResponse.data;

    const userInfoResponse = await axios.get<KakaoUserInfoResponse>(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    await axios.post(
      "https://nid.naver.com/oauth2.0/token",
      {
        grant_type: "delete",
        client_id: naverClientId,
        client_secret: naverClientSecret,
        access_token: tokens.access_token,
        service_provider: "NAVER",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const kakaoEmail = userInfoResponse.data.kakao_account.email;
    const userName = userInfoResponse.data.kakao_account.profile.nickname;

    const userDto = new UserDto({
      email: kakaoEmail!,
      userName: userName!,
      signUpPath: "kakao",
    });

    await this.userService.selectUserByEmail(userDto);

    if (typeof userDto.accountIdx === "undefined") {
      return res.redirect(
        `http://localhost/loginPage?userName=${userDto.userName}&email=${userDto.email}&signUpPath=${userDto.signUpPath}`
      );
    } else {
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

      return res.redirect(
        `http://localhost/mainPage?accessToken=${accessToken}`
      );
    }
  }

  async naverLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const state = crypto.randomBytes(32).toString("hex");

    res.redirect(
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${naverRedirectUrl}&state=${state}`
    );
  }

  async naverOAuthCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const authorizationCode = req.query.code as string;
    const authorizationState = req.query.state as string;

    if (req.query.error === "access_denied") {
      return res.redirect(`http://localhost/users/login/naver`);
    }

    const tokenResponse = await axios.post<{ access_token: string }>(
      "https://nid.naver.com/oauth2.0/token",
      {
        code: authorizationCode,
        state: authorizationState,
        client_id: naverClientId,
        client_secret: naverClientSecret,
        redirect_uri: naverRedirectUrl,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const tokens = tokenResponse.data;

    const userInfoResponse = await axios.get<naverUserInfoResponse>(
      "https://openapi.naver.com/v1/nid/me",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const naverEmail = userInfoResponse.data.response.email;
    const userName = userInfoResponse.data.response.name;

    const userDto = new UserDto({
      email: naverEmail!,
      userName: userName!,
      signUpPath: "naver",
    });

    await this.userService.selectUserByEmail(userDto);

    if (typeof userDto.accountIdx === "undefined") {
      return res.redirect(
        `http://localhost/loginPage?userName=${userDto.userName}&email=${userDto.email}&signUpPath=${userDto.signUpPath}`
      );
    } else {
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

      return res.redirect(
        `http://localhost/mainPage?accessToken=${accessToken}`
      );
    }
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
