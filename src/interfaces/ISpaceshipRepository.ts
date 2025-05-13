import { Spaceship } from './ISpaceship'

export interface SpaceshipRepository {
  getSize(): number
  getById(id: string): Promise<Spaceship | null>
  getAll(): Promise<Spaceship[]>
}
