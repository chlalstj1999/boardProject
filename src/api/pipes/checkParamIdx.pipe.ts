import { BadRequestException } from "../../common/exception/BadRequestException";

export class CheckParamIdxPipe {
  static checkParamIdx = (params: string[]) => {
    const paramsName = params[0];
    const paramsIdx = params[1];

    const paramsIdxNumber = Number(paramsIdx);

    if (!paramsIdxNumber) {
      throw new BadRequestException(`${paramsName}값이 안 옴`);
    }

    return paramsIdxNumber;
  };
}
