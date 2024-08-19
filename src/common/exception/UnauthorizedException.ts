import { Exception } from "./Exception";

export class UnauthorizedException extends Exception {
  constructor(message: string) {
    super(401, message);
  }
}
