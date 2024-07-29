import { BadRequestException } from "../../../common/exception/BadRequestException";
import { regx } from "../../../common/const/regx";

export class FindPwDto {
  userName: string;
  idValue: string;

  constructor(data: { userName: string; idValue: string }) {
    this.userName = data.userName;
    this.idValue = data.idValue;
  }

  static checkFindPwDto(data: FindPwDto) {
    if (!data.userName.match(regx.userNameRegx)) {
      throw new BadRequestException("이름 확인 필요");
    }

    if (!data.idValue.match(regx.idRegx)) {
      throw new BadRequestException("id 확인 필요");
    }
  }
}
