import { Spaceship } from '../interfaces/ISpaceship'
import { SpaceshipRepository } from '../interfaces/ISpaceshipRepository'
import { spaceshipsMap } from '../services/dataStore'

class InMemorySpaceshipRepository implements SpaceshipRepository {
  getSize(): number {
    return spaceshipsMap.size
  }
  async getById(id: string): Promise<Spaceship | null> {
    return spaceshipsMap.get(id) || null
  }

  async getAll(): Promise<Spaceship[]> {
    return Array.from(spaceshipsMap.values())
  }
}

export { InMemorySpaceshipRepository }
