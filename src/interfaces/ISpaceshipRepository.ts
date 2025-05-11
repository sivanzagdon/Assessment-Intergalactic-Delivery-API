import { Spaceship } from './ISpaceship'

export interface SpaceshipRepository {
  getById(id: string): Promise<Spaceship | null>
  getAll(): Promise<Spaceship[]>
}
