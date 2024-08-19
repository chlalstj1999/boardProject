import { UnauthorizedException } from "../../common/exception/UnauthorizedException";

export function checkLogin(accountIdx: number | undefined): number {
  if (!accountIdx) {
    throw new UnauthorizedException("login 필요");
  }

  return Number(accountIdx);
}
