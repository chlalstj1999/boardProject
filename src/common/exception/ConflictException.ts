import { Exception } from "./Exception";

export class ConflictException extends Exception {
  constructor(message: string) {
    super(409, message);
  }
}
