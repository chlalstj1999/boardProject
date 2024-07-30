import { BadRequestException } from "../../common/exception/BadRequestException";

export class CheckQueryIdxPipe {
  static checkQueryIdx = (params: any[]) => {
    const QueryName = params[0];
    const QueryIdx = params[1];

    const QueryIdxNumber = Number(QueryIdx);

    if (!QueryIdxNumber) {
      throw new BadRequestException(`${QueryName}값이 안 옴`);
    }

    return QueryIdxNumber;
  };
}
