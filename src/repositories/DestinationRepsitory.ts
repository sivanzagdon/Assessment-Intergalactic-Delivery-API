import { Destination } from '../interfaces/IDestination'
import { DestinationRepository } from '../interfaces/IDestinationRepository'
import { destinationsMap } from '../services/dataStoreService'

class InMemoryDestinatiomRepository implements DestinationRepository {
  async getAll(): Promise<Destination[]> {
    return Array.from(destinationsMap.values())
  }
}
export { InMemoryDestinatiomRepository }
