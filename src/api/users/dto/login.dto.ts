import { BadRequestException } from "../../../common/exception/BadRequestException";
import { regx } from "../../../common/const/regx";

export class LoginDto {
  idValue: string;
  pwValue: string;

  constructor(data: { idValue: string; pwValue: string }) {
    this.idValue = data.idValue;
    this.pwValue = data.pwValue;
  }

  static checkLoginDto(data: any) {
    if (!data.idValue.match(regx.idRegx)) {
      throw new BadRequestException("ID 확인 필요");
    }

    if (!data.pwValue.match(regx.pwRegx)) {
      throw new BadRequestException("password 확인 필요");
    }
  }
}
