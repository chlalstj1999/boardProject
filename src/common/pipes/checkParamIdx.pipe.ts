import { BadRequestException } from "../../common/exception/BadRequestException";

export function checkParamIdx(params: string[]): number {
  const paramsName = params[0];
  const paramsIdx = params[1];

  const paramsIdxNumber = Number(paramsIdx);

  if (!paramsIdxNumber) {
    throw new BadRequestException(`${paramsName}값이 안 옴`);
  }

  return paramsIdxNumber;
}
