import { admin } from "../../common/const/role";
import { UnauthorizedException } from "../../common/exception/UnauthorizedException";

export function checkRole(roleIdx: number | undefined) {
  if (roleIdx !== admin) {
    throw new UnauthorizedException("관리자 권한 필요");
  }

  return roleIdx;
}
