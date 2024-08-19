import { Exception } from "./Exception";

export class InternalServerErrorException extends Exception {
  constructor(message: string) {
    super(500, message);
  }
}
