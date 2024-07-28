import { Request, Response, NextFunction } from "express";
import { SignUpDto } from "./dto/SignUp.dto";
import { UserService } from "./users.service";

export class UserController {
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    const signUpDto = req.body;
    await SignUpDto.createAccountDto(signUpDto);

    await UserService.createUser(signUpDto);

    res.status(200).send();
  };
}
