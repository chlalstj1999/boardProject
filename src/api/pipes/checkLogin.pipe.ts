import { UnauthorizedException } from "../../common/exception/UnauthorizedException";

export class CheckLoginPipe {
  static checkLogin = (accountIdx: number | undefined) => {
    if (!accountIdx) {
      throw new UnauthorizedException("login 필요");
    }

    return Number(accountIdx);
  };
}
