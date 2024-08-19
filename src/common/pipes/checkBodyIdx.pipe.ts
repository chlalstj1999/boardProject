import { BadRequestException } from "../../common/exception/BadRequestException";

export function checkParamIdx(params: string[]): number {
  const bodyName = params[0];
  const bodyIdx = params[1];

  const bodyIdxNumber = Number(bodyIdx);

  if (!bodyIdxNumber) {
    throw new BadRequestException(`${bodyName}값이 안 옴`);
  }

  return bodyIdxNumber;
}
