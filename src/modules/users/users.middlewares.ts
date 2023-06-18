import { User } from '@prisma/client'
import { compare } from 'bcrypt'
import AppError from '../../app-error'
import { UsersRepository } from './users.repository'
import { UsersCreateBodyDto, UsersLoginBodyDto } from './users.schema'

export class UsersMiddleware {
  constructor(private repository: UsersRepository) {}

  async auth({ login, password }: UsersLoginBodyDto): Promise<User> {
    const user =
      (await this.repository.findByEmail(login)) ||
      (await this.repository.findByLogin(login)) ||
      (await this.repository.findByPhone(login))

    if (!user || !(await compare(password, user.password))) {
      throw new AppError('Password or login incorrect', 404)
    }
    return user
  }

  async create(data: UsersCreateBodyDto): Promise<void> {
    if (await this.repository.findByEmail(data.email)) {
      throw new AppError('E-mail already registered', 409)
    }

    if (await this.repository.findByLogin(data.login)) {
      throw new AppError('Login already registered', 409)
    }

    if (await this.repository.findByPhone(data.phone)) {
      throw new AppError('Phone already registered', 409)
    }
  }

  async findOne(where: string): Promise<User | AppError> {
    const user =
      (await this.repository.findByEmail(where)) ||
      (await this.repository.findByLogin(where)) ||
      (await this.repository.findByPhone(where)) ||
      (await this.repository.findById(where))

    return user || new AppError('User not found', 404)
  }
}
