import { BadRequestException } from "../../../common/exception/BadRequestException";
import { regx } from "../../../common/const/regx";

export class FindIdDto {
  userName: string;
  email: string;

  constructor(data: { userName: string; email: string }) {
    this.userName = data.userName;
    this.email = data.email;
  }

  static checkFindIdDto(data: FindIdDto) {
    if (!data.userName.match(regx.userNameRegx)) {
      throw new BadRequestException("이름 확인 필요");
    }

    if (!data.email.match(regx.emailRegx)) {
      throw new BadRequestException("email 확인 필요");
    }
  }
}
