import { ConflictException } from "../../../common/exception/ConflictException";

export class DuplicateException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
