import { UsersRepositoryPrisma } from './users.repository'
import { UsersService } from './users.services'

export function makeUsersService(): UsersService {
  const usersRepository = new UsersRepositoryPrisma()
  return new UsersService(usersRepository)
}
