import { BadRequestException } from "../../common/exception/BadRequestException";

export function checkQueryIdx(params: any[]): number {
  const QueryName = params[0];
  const QueryIdx = params[1];

  const QueryIdxNumber = Number(QueryIdx);

  if (!QueryIdxNumber) {
    throw new BadRequestException(`${QueryName}값이 안 옴`);
  }

  return QueryIdxNumber;
}
