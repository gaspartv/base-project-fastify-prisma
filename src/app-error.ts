import { BAD_REQUEST } from './utils/http-status-code'

export default class AppError {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = BAD_REQUEST
  ) {}
}
